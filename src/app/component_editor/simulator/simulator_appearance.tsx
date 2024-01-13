import ProjectComponent from "@/app/project/project_component/project_component";
import { Vector3 } from "three";

export interface SizeInterface {

}

export interface BoxSizeInterface extends SizeInterface {
    "width": number,
    "height": number,
    "depth": number
}

export interface SphereSizeInterface extends SizeInterface {
    "radius": number
}

export interface SimulatorAppearanceJsonInterface {
    "shape": string,
    "position": Vector3,
    "size": SizeInterface
}

class SimulatorAppearance {
    parentComponent: ProjectComponent | null;
    shape: string;
    position: Vector3;
    size: SizeInterface;

    constructor(parentComponent: ProjectComponent | null, shape: string, position: Vector3, size: SizeInterface) {
        this.parentComponent = parentComponent;
        this.shape = shape;
        this.position = position;
        this.size = size;
    }

    setParentComponent(newParentComponent: ProjectComponent | null) {
        this.parentComponent = newParentComponent;
    }

    toJSON() {
        return {
            "shape": this.shape,
            "position": this.position,
            "size": this.size
        }
    }

    getShape() {
        return this.shape;
    }

    getPosition() {
        return this.position;
    }

    getSize() {
        return this.size;
    }

    saveToBrowser() {
        if (this.parentComponent !== null) {
            this.parentComponent.saveToBrowser();
        }
    }
    
    setShape(newShape: string) {
        this.shape = newShape;

        let newSize: SizeInterface;
        switch (newShape) {
            case "Box":
                newSize = {"width": 1, "height": 1, "depth": 1};
                break;
            case "Sphere":
                newSize = {"radius": 0.5};
                break;
            default:
                throw(`Unknown shape: ${newShape}`);
        }
        this.setSize(newSize);

        this.saveToBrowser();
    }

    setPosition(newPosition: Vector3) {
        this.position = newPosition;
        this.saveToBrowser();
    }

    setSize(newSize: SizeInterface) {
        this.size = newSize;
        this.saveToBrowser();
    }
}

export default SimulatorAppearance;