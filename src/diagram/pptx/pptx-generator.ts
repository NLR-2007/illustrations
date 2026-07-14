import pptxgen from 'pptxgenjs';
import { LayoutOutput, PositionedNode } from '../layout/layout-engine.js';
import { getPptxColors } from '../../theme/colors.js';

/**
 * Estimates if text fits inside a given shape width and height.
 */
export function estimateTextFitting(
  text: string, 
  w: number, 
  h: number, 
  fontSize: number
): { fits: boolean; lines: number; requiredHeight: number } {
  const charWidthRatio = 0.048; // Sans-serif spacing estimation factor
  const usableWidth = Math.max(0.5, w - 0.3); // Padding margin
  const maxCharsPerLine = Math.floor(usableWidth / (fontSize * charWidthRatio));
  const words = text.split(' ');
  
  let linesCount = 1;
  let currentLineLength = 0;

  for (const word of words) {
    if (currentLineLength + word.length > maxCharsPerLine) {
      linesCount++;
      currentLineLength = word.length;
    } else {
      currentLineLength += word.length + (currentLineLength > 0 ? 1 : 0);
    }
  }

  const lineHeightInches = (fontSize / 72) * 1.25;
  const requiredHeight = linesCount * lineHeightInches;
  const fits = requiredHeight <= (h - 0.15); // Vertically fits

  return { fits, lines: linesCount, requiredHeight };
}

/**
 * Optimizes font size and node width to fit the given text.
 */
export function optimizeNodeSizeAndText(
  node: PositionedNode
): { fontSize: number; w: number; text: string } {
  let fontSize = 12;
  let w = node.w;
  let text = node.text;

  // 1. Try reducing font size from 12 down to 8
  for (const size of [12, 10, 8]) {
    const res = estimateTextFitting(text, w, node.h, size);
    if (res.fits) {
      return { fontSize: size, w, text };
    }
  }

  // 2. Try expanding node width up to 2.8 inches
  for (const width of [2.2, 2.5, 2.8]) {
    const res = estimateTextFitting(text, width, node.h, 8);
    if (res.fits) {
      return { fontSize: 8, w: width, text };
    }
  }

  // 3. Truncate if still impossible to fit
  console.warn(`[WARN] Text too long for node "${node.id}". Truncating content.`);
  let truncated = text;
  while (truncated.length > 5 && !estimateTextFitting(truncated + '...', 2.8, node.h, 8).fits) {
    truncated = truncated.slice(0, truncated.length - 2);
  }
  return { fontSize: 8, w: 2.8, text: truncated + '...' };
}

/**
 * Generates a PPTX file from the computed LayoutOutput.
 */
export async function generatePptx(layout: LayoutOutput, outputPath: string): Promise<string> {
  const pres = new (pptxgen as any)();
  
  // Set Widescreen 16:9
  pres.layout = 'LAYOUT_16x9';

  const slide = pres.addSlide();
  const colors = getPptxColors();

  // Add Background
  slide.background = { color: colors.lightBackground };

  // Add Slide Title
  slide.addText(layout.title, {
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

  // Render extra shapes if any (e.g. Venn circles, timeline axis lines)
  if (layout.extraShapes) {
    layout.extraShapes.forEach(shape => {
      const typeStr = shape.type;
      let pptxShape = shapes.RECTANGLE;
      if (typeStr === 'oval') pptxShape = shapes.OVAL;
      if (typeStr === 'line') pptxShape = shapes.LINE;

      const fillOptions = shape.fill === 'transparent' ? undefined : { color: colors.white };
      const borderOptions = shape.border ? { color: colors.black, width: 1.5 } : undefined;

      if (typeStr === 'line') {
        slide.addShape(shapes.LINE, {
          x: shape.x,
          y: shape.y,
          w: shape.w,
          h: shape.h,
          line: { color: colors.black, width: 2 }
        });
      } else {
        slide.addShape(pptxShape, {
          x: shape.x,
          y: shape.y,
          w: shape.w,
          h: shape.h,
          fill: fillOptions,
          line: borderOptions
        });
      }
    });
  }

  // Render Nodes
  layout.nodes.forEach(node => {
    // 1. Optimize size and font size
    const opt = optimizeNodeSizeAndText(node);
    
    // Shift x slightly if node width expanded, to keep it centered
    const diffW = opt.w - node.w;
    const adjustedX = node.x - diffW / 2;

    // 2. Map shape type
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
      default:
        shapeType = shapes.RECTANGLE;
    }

    // Node colors
    const fillCol = node.highlight ? colors.accentYellow : colors.white;
    const borderCol = colors.black;

    if (isAnnotation) {
      // Annotations are transparent borderless text boxes
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
      // Connectors are small circles, text inside is usually just a letter or empty
      slide.addShape(shapes.OVAL, {
        x: adjustedX + (opt.w - 0.4) / 2,
        y: node.y + (node.h - 0.4) / 2,
        w: 0.4,
        h: 0.4,
        fill: { color: fillCol },
        line: { color: borderCol, width: 1.5 }
      });
      if (opt.text) {
        slide.addText(opt.text, {
          x: adjustedX + (opt.w - 0.4) / 2,
          y: node.y + (node.h - 0.4) / 2,
          w: 0.4,
          h: 0.4,
          align: 'center',
          valign: 'middle',
          fontSize: 9,
          bold: true,
          color: colors.black,
          fontFace: 'Arial'
        });
      }
    } else {
      // Standard shape with background fill and border
      slide.addShape(shapeType, {
        x: adjustedX,
        y: node.y,
        w: opt.w,
        h: node.h,
        fill: { color: fillCol },
        line: { color: borderCol, width: 1.5 }
      });

      // Add text label inside shape
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

  // Render Connector Lines / Arrows
  layout.connections.forEach(conn => {
    // Draw connecting line arrow
    slide.addShape(shapes.LINE, {
      x: conn.fromX,
      y: conn.fromY,
      w: conn.toX - conn.fromX,
      h: conn.toY - conn.fromY,
      line: {
        color: colors.black,
        width: 1.5,
        endArrowType: conn.toId === 'axis' ? 'none' : 'triangle'
      }
    });

    // If connection has a label, add it alongside the arrow
    if (conn.label) {
      const labelX = (conn.fromX + conn.toX) / 2 - 0.4;
      const labelY = (conn.fromY + conn.toY) / 2 - 0.25;
      
      slide.addText(conn.label, {
        x: labelX,
        y: labelY,
        w: 0.8,
        h: 0.3,
        align: 'center',
        valign: 'middle',
        fontSize: 9,
        color: colors.secondaryGray,
        fontFace: 'Arial',
        bold: true
      });
    }
  });

  // Save the slide
  await pres.writeFile({ fileName: outputPath });
  return outputPath;
}
