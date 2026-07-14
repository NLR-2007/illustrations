import fs from 'fs';
import path from 'path';
import pptxgen from 'pptxgenjs';
import { RequestInput } from '../schemas/request-schema.js';
import { DiagramInput } from '../schemas/diagram-schema.js';
import { generateIllustration } from '../illustration/generation/generator.js';
import { computeLayout, LayoutOptions } from '../diagram/layout/layout-engine.js';
import { optimizeNodeSizeAndText } from '../diagram/pptx/pptx-generator.js';
import { getPptxColors } from '../theme/colors.js';

/**
 * Registry of default diagrams for hybrid visual topics.
 */
const DEFAULT_HYBRID_DIAGRAMS: Record<string, DiagramInput> = {
  api: {
    title: 'How APIs Work (Technical Flow)',
    type: 'flowchart',
    direction: 'top-to-bottom',
    nodes: [
      { id: 'client', type: 'start_end', text: 'Client App' },
      { id: 'api', type: 'process', text: 'API Gateway', highlight: true },
      { id: 'backend', type: 'process', text: 'Backend Server' },
      { id: 'db', type: 'database', text: 'Database' }
    ],
    connections: [
      { from: 'client', to: 'api', label: 'HTTP Req' },
      { from: 'api', to: 'backend', label: 'Route' },
      { from: 'backend', to: 'db', label: 'SQL Query' }
    ]
  },
  ml: {
    title: 'Machine Learning Pipeline',
    type: 'flowchart',
    direction: 'top-to-bottom',
    nodes: [
      { id: 'data', type: 'input_output', text: 'Raw Data' },
      { id: 'preprocess', type: 'process', text: 'Feature Eng' },
      { id: 'train', type: 'process', text: 'Train Model', highlight: true },
      { id: 'eval', type: 'decision', text: 'Accuracy > 90%?' },
      { id: 'deploy', type: 'process', text: 'Deploy Model' }
    ],
    connections: [
      { from: 'data', to: 'preprocess' },
      { from: 'preprocess', to: 'train' },
      { from: 'train', to: 'eval' },
      { from: 'eval', to: 'deploy', label: 'Yes' },
      { from: 'eval', to: 'preprocess', label: 'No' }
    ]
  }
};

/**
 * Generates hybrid slide decks.
 */
export async function generateHybridDeck(
  request: RequestInput, 
  customDiagram?: DiagramInput
): Promise<{ pptxPath: string; promptManifestPath: string }> {
  // 1. Generate mascot illustration prompt package
  const illResult = await generateIllustration(request);

  // 2. Resolve diagram input
  const topicKey = request.topic.toLowerCase().includes('api') ? 'api' : 
                   request.topic.toLowerCase().includes('machine') ? 'ml' : '';
  const diagram: DiagramInput = customDiagram || DEFAULT_HYBRID_DIAGRAMS[topicKey] || {
    title: `${request.topic} (Process Flow)`,
    type: 'flowchart',
    nodes: [
      { id: 'input', type: 'start_end', text: 'Input State' },
      { id: 'process', type: 'process', text: `Execute ${request.topic}`, highlight: true },
      { id: 'output', type: 'start_end', text: 'Output State' }
    ],
    connections: [
      { from: 'input', to: 'process' },
      { from: 'process', to: 'output' }
    ]
  };

  // 3. Define layout sizes for Side-by-Side (Illustration Left, Diagram Right)
  const illBox = { x: 0.8, y: 1.8, w: 5.2, h: 4.8 };
  const diagBox: LayoutOptions = {
    canvasWidth: 12.5,
    canvasHeight: 7.0,
    startX: 6.6,
    startY: 1.8,
    nodeWidth: 1.6,
    nodeHeight: 0.8,
    verticalGap: 0.5,
    horizontalGap: 0.5
  };

  // Compute diagram layout coordinates in the right pane bounding box
  const diagLayout = computeLayout(diagram, diagBox);

  // 4. Initialize PptxGenJS presentation
  const pres = new (pptxgen as any)();
  pres.layout = 'LAYOUT_16x9';

  const slide = pres.addSlide();
  const colors = getPptxColors();
  slide.background = { color: colors.lightBackground };

  // Add Widescreen title
  slide.addText(request.topic, {
    x: 0.8,
    y: 0.5,
    w: 11.7,
    h: 0.8,
    fontSize: 24,
    fontFace: 'Arial',
    bold: true,
    color: colors.black,
    valign: 'middle'
  });

  const shapes = pres.shapes || {};

  // Check if illustration image was automatically downloaded (API mode)
  // or if we place a clean vector-placeholder box (Manual mode)
  const imageDownloaded = illResult.success && illResult.imagePath && fs.existsSync(illResult.imagePath) && 
                          !illResult.imagePath.includes('.placeholder');

  if (imageDownloaded && illResult.imagePath) {
    slide.addImage({
      path: illResult.imagePath,
      x: illBox.x,
      y: illBox.y,
      w: illBox.w,
      h: illBox.h
    });
  } else {
    // Render an elegant placeholder container
    slide.addShape(shapes.RECTANGLE, {
      x: illBox.x,
      y: illBox.y,
      w: illBox.w,
      h: illBox.h,
      fill: { color: colors.white },
      line: { color: colors.lightGray, width: 2, dashType: 'dash' }
    });

    slide.addText(`Mascot Illustration Placeholder\n\n[Scene Analogy: ${request.topic}]\n\nGenerate and drag your mascot image here.\nPrompt metadata generated inside output/${request.outputName}/`, {
      x: illBox.x + 0.3,
      y: illBox.y + 0.5,
      w: illBox.w - 0.6,
      h: illBox.h - 1.0,
      align: 'center',
      valign: 'middle',
      fontSize: 11,
      color: colors.secondaryGray,
      fontFace: 'Arial',
      italic: true
    });

    // Add visual accent highlights to placeholder
    slide.addShape(shapes.OVAL, {
      x: illBox.x + (illBox.w - 0.6) / 2,
      y: illBox.y + 0.4,
      w: 0.6,
      h: 0.6,
      fill: { color: colors.accentYellow },
      line: { color: colors.black, width: 1.5 }
    });
  }

  // 5. Render Diagram Shapes on the Right Side
  diagLayout.nodes.forEach(node => {
    const opt = optimizeNodeSizeAndText(node);
    const diffW = opt.w - node.w;
    const adjustedX = node.x - diffW / 2;

    let shapeType = shapes.RECTANGLE;
    let isAnnotation = false;

    switch (node.type) {
      case 'start_end':
        shapeType = shapes.OVAL;
        break;
      case 'process':
        shapeType = shapes.RECTANGLE;
        break;
      case 'decision':
        shapeType = shapes.DIAMOND;
        break;
      case 'input_output':
        shapeType = shapes.PARALLELOGRAM;
        break;
      case 'database':
        shapeType = shapes.CAN;
        break;
      case 'document':
        shapeType = shapes.FLOWCHART_DOCUMENT || shapes.RECTANGLE;
        break;
      case 'connector':
        shapeType = shapes.OVAL;
        break;
      case 'annotation':
        isAnnotation = true;
        break;
    }

    const fillCol = node.highlight ? colors.accentYellow : colors.white;
    const borderCol = colors.black;

    if (isAnnotation) {
      slide.addText(opt.text, {
        x: adjustedX,
        y: node.y,
        w: opt.w,
        h: node.h,
        align: 'center',
        valign: 'middle',
        fontSize: opt.fontSize,
        color: colors.secondaryGray,
        fontFace: 'Arial',
        italic: true
      });
    } else if (node.type === 'connector') {
      slide.addShape(shapes.OVAL, {
        x: adjustedX + (opt.w - 0.3) / 2,
        y: node.y + (node.h - 0.3) / 2,
        w: 0.3,
        h: 0.3,
        fill: { color: fillCol },
        line: { color: borderCol, width: 1.5 }
      });
    } else {
      slide.addShape(shapeType, {
        x: adjustedX,
        y: node.y,
        w: opt.w,
        h: node.h,
        fill: { color: fillCol },
        line: { color: borderCol, width: 1.5 }
      });

      slide.addText(opt.text, {
        x: adjustedX,
        y: node.y,
        w: opt.w,
        h: node.h,
        align: 'center',
        valign: 'middle',
        fontSize: opt.fontSize,
        color: colors.black,
        fontFace: 'Arial',
        bold: node.highlight
      });
    }
  });

  // Render Diagram Connectors on the Right Side
  diagLayout.connections.forEach(conn => {
    slide.addShape(shapes.LINE, {
      x: conn.fromX,
      y: conn.fromY,
      w: conn.toX - conn.fromX,
      h: conn.toY - conn.fromY,
      line: {
        color: colors.black,
        width: 1.5,
        endArrowType: 'triangle'
      }
    });

    if (conn.label) {
      const labelX = (conn.fromX + conn.toX) / 2 - 0.4;
      const labelY = (conn.fromY + conn.toY) / 2 - 0.2;
      slide.addText(conn.label, {
        x: labelX,
        y: labelY,
        w: 0.8,
        h: 0.3,
        align: 'center',
        valign: 'middle',
        fontSize: 8,
        color: colors.secondaryGray,
        fontFace: 'Arial'
      });
    }
  });

  // 6. Output PowerPoint file
  const pptxPath = path.join('output', request.outputName, `${request.outputName}.pptx`);
  await pres.writeFile({ fileName: pptxPath });

  return {
    pptxPath,
    promptManifestPath: illResult.manifestPath || ''
  };
}
