import Difficulties from "../project/project_component/components/difficulties/difficulties"
import DocumentationSection from "../project/project_component/components/documentation_section"
import ProjectComponent from "../project/project_component/project_component"

export interface CommandParamFuncResolverInterface {
    "dependencyInd": number,
    "resolverFunc": ((inputObj: DocumentationSection) => string) | ((inputObj: Difficulties) => string)
}

export interface CommandJsonInterface {
    "dependencies": number[],
    "commandName": string,
    "commandParams": (string | CommandParamFuncResolverInterface)[]
}