import ProjectComponent from "../../project/project_component/project_component";
import "../../globals.css";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import THREE, { BoxGeometry, SphereGeometry, Vector3 } from "three";
import { OrbitControls } from "@react-three/drei";
import SimulatorAppearance, { BoxSizeInterface, SizeInterface, SphereSizeInterface } from "./simulator_appearance";
 
const SimulatorInterfaceEditor = (props: {appearance: SimulatorAppearance}) => {
    const [shape, setShape] = useState<string>(props.appearance.getShape());
    const [position, setPosition] = useState<Vector3>(props.appearance.getPosition());
    const [size, setSize] = useState<SizeInterface>(props.appearance.getSize());

    useEffect(() => {
        setShape(props.appearance.getShape());
        setPosition(props.appearance.getPosition());
        setSize(props.appearance.getSize());
    }, [props.appearance]);

    function shapeOnChangeHandler(newShape: string) {
        props.appearance.setShape(newShape);
        setShape(newShape);
        setSize(props.appearance.getSize());
    }

    function setXPosition(newXPos: string) {
        let newPosition: Vector3 = new Vector3(parseFloat(newXPos), position.y, position.z);
        props.appearance.setPosition(newPosition);
        setPosition(newPosition);
    }

    function setYPosition(newYPos: string) {
        let newPosition: Vector3 = new Vector3(position.x, parseFloat(newYPos), position.z);
        props.appearance.setPosition(newPosition);
        setPosition(newPosition);
    }

    function setZPosition(newZPos: string) {
        let newPosition: Vector3 = new Vector3(position.x, position.y, parseFloat(newZPos));
        props.appearance.setPosition(newPosition);
        setPosition(newPosition);
    }

    function sizeOnChangeHandler(newSize: SizeInterface) {
        props.appearance.setSize(newSize);
        setSize(newSize);
    }

    function parseAppearance() {
        let geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes> | undefined;
        switch (shape) {
            case "Box":
                let boxSize: BoxSizeInterface = size as BoxSizeInterface;
                geometry = new BoxGeometry(boxSize.width, boxSize.height, boxSize.depth);
                break;
            case "Sphere":
                let sphereSize: SphereSizeInterface = size as SphereSizeInterface;
                geometry = new SphereGeometry(sphereSize.radius);
                break;
            default:
                throw(`Unknown shape: ${shape}`);
        }
        return (
            <mesh
                position={new Vector3(position.x, position.y, position.z)}
                geometry={geometry}
            >
                <meshBasicMaterial color={'lime'} wireframe/>
            </mesh>
        );
    }

    function getSizeFields() {
        switch (shape) {
            case "Box":
                let boxSize: BoxSizeInterface = size as BoxSizeInterface;
                return (
                    <div className="sideBySideContainer">
                        <p>Width: <input type="text" value={boxSize.width} onChange={e => sizeOnChangeHandler({"width": e.target.value, "height": boxSize.height, "depth": boxSize.depth})}/></p>
                        <p>Height: <input type="text" value={boxSize.height} onChange={e => sizeOnChangeHandler({"width": boxSize.width, "height": e.target.value, "depth": boxSize.depth})}/></p>
                        <p>Depth: <input type="text" value={boxSize.depth} onChange={e => sizeOnChangeHandler({"width": boxSize.width, "height": boxSize.height, "depth": e.target.value})}/></p>
                    </div>
                );
            case "Sphere":
                let sphereSize: SphereSizeInterface = size as SphereSizeInterface;
                return (
                    <div className="sideBySideContainer">
                        <p>Radius: <input type="text" value={sphereSize.radius} onChange={e => sizeOnChangeHandler({"radius": e.target.value})}/></p>
                    </div>
                );
            default:
                throw(`Unknown shape: ${shape}`);
        }
    }

    return (
        <div className="sideBySideContainer" style={{height: "100%"}}>
            <div style={{height: "100%", width: "50%", display: "flex", flexDirection: "column"}}>
                <p>Shape:<select onChange={e => shapeOnChangeHandler(e.target.value)} value={shape}>
                    <option value="Box">Box</option>
                    <option value="Sphere">Sphere</option>
                </select></p>
                <div className="sideBySideContainer">
                    <p>X Position: <input type="text" value={props.appearance.getPosition().x} onChange={e => setXPosition(e.target.value)}/></p>
                    <p>Y Position: <input type="text" value={props.appearance.getPosition().y} onChange={e => setYPosition(e.target.value)}/></p>
                    <p>Z Position: <input type="text" value={props.appearance.getPosition().z} onChange={e => setZPosition(e.target.value)}/></p>
                </div>
                {getSizeFields()}
            </div>

            <div style={{width: "50%", height: "100%"}}>
                <Canvas camera={{ position: [1, 2, 3] }}>
                    {parseAppearance()}
                    <OrbitControls/>
                    <axesHelper args={[5]}/>
                    <gridHelper/>
                </Canvas>
            </div>
        </div>
    )
}

export default SimulatorInterfaceEditor;