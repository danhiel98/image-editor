import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { useEffect, useState } from "react";
import useWindowDimensions from "../src/hooks/useWindowDimensions";
import { HiPencil } from "react-icons/hi";
import { BiCircle, BiRectangle, BiTrashAlt } from "react-icons/bi";

export default function Home() {
  const { editor, onReady } = useFabricJSEditor();
  const { width, height } = useWindowDimensions();
  const [color, setColor] = useState("#6B7280");
  const [size, setSize] = useState(2);

  useEffect(() => {}, []);

  useEffect(() => {
    if (editor) {
      // editor.canvas.setDimensions({ width: width, height: height });

      // editor.canvas.on("mouse:wheel", function (opt) {
      //   var delta = opt.e.deltaY;
      //   var zoom = editor.canvas.getZoom();
      //   zoom *= 0.999 ** delta;
      //   if (zoom > 20) zoom = 20;
      //   if (zoom < 0.01) zoom = 0.01;
      //   editor.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      //   opt.e.preventDefault();
      //   opt.e.stopPropagation();
      //   var vpt = this.viewportTransform;
      //   if (zoom < 400 / 1000) {
      //     vpt[4] = 200 - (1000 * zoom) / 2;
      //     vpt[5] = 200 - (1000 * zoom) / 2;
      //   } else {
      //     if (vpt[4] >= 0) {
      //       vpt[4] = 0;
      //     } else if (vpt[4] < editor.canvas.getWidth() - 1000 * zoom) {
      //       vpt[4] = editor.canvas.getWidth() - 1000 * zoom;
      //     }
      //     if (vpt[5] >= 0) {
      //       vpt[5] = 0;
      //     } else if (vpt[5] < editor.canvas.getHeight() - 1000 * zoom) {
      //       vpt[5] = editor.canvas.getHeight() - 1000 * zoom;
      //     }
      //   }
      // });

      fabric.Image.fromURL(
        "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
        (img) => {
          // img.scaleToWidth(editor.canvas.width);
          // console.log(`Screen width: ${width}`);
          // console.log({ height: img.height, width: img.width });

          if (img.width > width) {
            img.scaleToWidth(editor.canvas.width);
            editor.canvas.setDimensions({
              height: img.getScaledHeight(),
            });
          } else {
            img.scaleToHeight(editor.canvas.height);
            editor.canvas.setDimensions({
              width: img.getScaledWidth(),
            });
          }
          // if (img.width > img.height) {
          //   img.scaleToWidth(editor.canvas.width);
          // } else {
          //   img.scaleToHeight(editor.canvas.height);
          //   editor.canvas.setDimensions({
          //     width: img.getScaledWidth(),
          //   });
          // }

          editor.canvas.setBackgroundImage(img);
          editor.canvas.requestRenderAll();
        },
        {
          crossOrigin: "Annoymous",
        }
      );
    }
  }, [editor, width]);

  const handleColorChange = (color) => {
    setColor(color);
    editor.canvas.freeDrawingBrush.color = color;
    editor.canvas.getActiveObjects().forEach((obj) => {
      obj.set("stroke", color);
    });
    // editor.canvas.renderAll();
  };

  const handleSizeChange = (size) => {
    setSize(size);
    editor.canvas.freeDrawingBrush.width = size;
    editor.canvas.getActiveObjects().forEach((obj) => {
      obj.set("strokeWidth", size);
    });
  };

  const drawingMode = () => {
    editor.canvas.off("mouse:down");
    editor.canvas.off("mouse:move");
    editor.canvas.off("mouse:up");
    editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
    editor.canvas.freeDrawingBrush.width = size;
    editor.canvas.freeDrawingBrush.color = color;
  };

  const onAddCircle = () => {
    editor.canvas.off("mouse:down");
    editor.canvas.off("mouse:move");
    editor.canvas.off("mouse:up");
    editor.canvas.selectionColor = "rgba(31, 169, 224, 0.1)";
    let circle, isDown, origX, origY;
    // editor.canvas.isDrawingMode = true;
    // editor.canvas.freeDrawingBrush = null;

    editor.canvas.on("mouse:down", (o) => {
      if (editor.canvas.getActiveObjects().length > 0) return;
      isDown = true;
      let pointer = editor.canvas.getPointer(o.e);
      origX = pointer.x;
      origY = pointer.y;
      circle = new fabric.Circle({
        left: origX,
        top: origY,
        originX: "left",
        originY: "top",
        radius: pointer.x - origX,
        angle: 0,
        fill: "",
        stroke: color,
        strokeWidth: size,
      });
      editor.canvas.add(circle);
    });

    editor.canvas.on("mouse:move", (o) => {
      if (!isDown) return;
      let pointer = editor.canvas.getPointer(o.e);
      let radius =
        Math.max(Math.abs(origY - pointer.y), Math.abs(origX - pointer.x)) / 2;
      if (radius > circle.strokeWidth) {
        radius -= circle.strokeWidth / 2;
      }
      circle.set({ radius: radius });
      if (origX > pointer.x) {
        circle.set({ originX: "right" });
      } else {
        circle.set({ originX: "left" });
      }
      if (origY > pointer.y) {
        circle.set({ originY: "bottom" });
      } else {
        circle.set({ originY: "top" });
      }
      editor.canvas.renderAll();
    });

    editor.canvas.on("mouse:up", (o) => {
      isDown = false;
    });

    // editor?.addCircle();
  };
  const onAddRectangle = () => {
    editor.canvas.off("mouse:down");
    editor.canvas.off("mouse:move");
    editor.canvas.off("mouse:up");
    let rect, isDown, origX, origY;

    editor.canvas.on("mouse:down", (o) => {
      if (editor.canvas.getActiveObjects().length > 0) return;
      isDown = true;
      let pointer = editor.canvas.getPointer(o.e);
      origX = pointer.x;
      origY = pointer.y;
      pointer = editor.canvas.getPointer(o.e);
      rect = new fabric.Rect({
        left: origX,
        top: origY,
        originX: "left",
        originY: "top",
        width: pointer.x - origX,
        height: pointer.y - origY,
        angle: 0,
        fill: "",
        stroke: color,
        strokeWidth: size,
        transparentCorners: false,
      });

      editor.canvas.add(rect);
    });

    editor.canvas.on("mouse:move", (o) => {
      if (!isDown) return;

      let pointer = editor.canvas.getPointer(o.e);

      if (origX > pointer.x) {
        rect.set({ left: Math.abs(pointer.x) });
      }

      if (origY > pointer.y) {
        rect.set({ top: Math.abs(pointer.y) });
      }

      rect.set({ width: Math.abs(origX - pointer.x) });
      rect.set({ height: Math.abs(origY - pointer.y) });

      editor.canvas.renderAll();
    });

    editor.canvas.on("mouse:up", function (o) {
      isDown = false;
    });

    // editor?.addRectangle();
  };

  const deleteSelection = () => {
    editor.canvas.getActiveObjects().forEach((obj) => {
      editor.canvas.remove(obj);
    });
    editor.canvas.discardActiveObject().renderAll();
  };

  return (
    <div
      className="w-screen h-screen p-4 bg-gray-700"
      onKeyDown={deleteSelection}
      tabIndex="0"
    >
      <div className="max-w-lg mx-auto space-x-1">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={drawingMode}
        >
          <HiPencil className="text-base" />
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={onAddCircle}
        >
          <BiCircle className="text-base" />
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={onAddRectangle}
        >
          <BiRectangle className="text-base" />
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={deleteSelection}
        >
          <BiTrashAlt className="text-base" />
        </button>
      </div>
      <FabricJSCanvas
        className="max-w-lg md:h-96 max-h-96 mx-auto mt-2 border-2 border-yellow-400 flex justify-center items-center"
        onReady={onReady}
      />
      <div className="max-w-lg mx-auto mt-2 space-x-1 py-2 flex justify-between">
        <div className="flex">
          <div className="w-8 h-8 flex items-center justify-center">
            <button
              className="w-6 h-6 hover:w-7 hover:h-7 bg-gray-500 rounded-full"
              onClick={() => handleColorChange("#6B7280")}
            />
          </div>
          <div className="w-8 h-8 flex items-center justify-center">
            <button
              className="w-6 h-6 hover:w-7 hover:h-7 bg-white rounded-full"
              onClick={() => handleColorChange("#FFFFFF")}
            />
          </div>
          <div className="w-8 h-8 flex items-center justify-center">
            <button
              className="w-6 h-6 hover:w-7 hover:h-7 bg-blue-400 rounded-full"
              onClick={() => handleColorChange("#60A5FA")}
            />
          </div>
          <div className="w-8 h-8 flex items-center justify-center">
            <button
              className="w-6 h-6 hover:w-7 hover:h-7 bg-green-500 rounded-full"
              onClick={() => handleColorChange("#10B981")}
            />
          </div>
          <div className="w-8 h-8 flex items-center justify-center">
            <button
              className="w-6 h-6 hover:w-7 hover:h-7 bg-indigo-400 rounded-full"
              onClick={() => handleColorChange("#818CF8")}
            />
          </div>
          <div className="w-8 h-8 flex items-center justify-center">
            <button
              className="w-6 h-6 hover:w-7 hover:h-7 bg-yellow-400 rounded-full"
              onClick={() => handleColorChange("#FBBF24")}
            />
          </div>
          <div className="w-8 h-8 flex items-center justify-center">
            <button
              className="w-6 h-6 hover:w-7 hover:h-7 bg-red-500 rounded-full"
              onClick={() => handleColorChange("#EF4444")}
            />
          </div>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <button
            className="w-2 h-2 focus:bg-white bg-gray-400 rounded-full"
            onClick={() => handleSizeChange(2)}
          />
          <button
            className="w-3 h-3 focus:bg-white bg-gray-400 rounded-full"
            onClick={() => handleSizeChange(4)}
          />
          <button
            className="w-4 h-4 focus:bg-white bg-gray-400 rounded-full"
            onClick={() => handleSizeChange(6)}
          />
          <button
            className="w-5 h-5 focus:bg-white bg-gray-400 rounded-full"
            onClick={() => handleSizeChange(8)}
          />
        </div>
      </div>
    </div>
  );
}
