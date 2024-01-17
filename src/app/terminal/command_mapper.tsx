import { CommandJsonInterface } from "./command_json_interface";

export function mapRawTextToCommands(rawText: string) {
    let commands: CommandJsonInterface[] = [];
    for (let currLine of rawText.split("\n")) {
        let formattedLine: string = currLine.replace(/\s\s+/g, ' ');
        if (formattedLine === "") {
            continue
        }
        let lineParts: string[] = formattedLine.split(/\s(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        let commandName: string = lineParts[0];
        let commandParams: string[] = [];
        for (let i: number = 1; i < lineParts.length; i++) {
            commandParams.push(lineParts[i].replace(/['"]+/g, ''));
        }
        commands.push({"commandName": commandName, "commandParams": commandParams});
    }
    return commands;
}