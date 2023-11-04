class Project {
    projectSet: Boolean = false;
    documentationLink: string = "";

    constructor() {}

    setFromJson(jsonStr: string) {
        let parsedJson = JSON.parse(jsonStr);
        if (parsedJson.hasOwnProperty("documentationLink")) {
            this.documentationLink = parsedJson["documentationLink"];
        } else {
            this.documentationLink = "No documentation stored in project.";
        }
        this.projectSet = true;
    }

    toHtml() {
        if (!this.projectSet) {
            return (
                <div>
                    <p>Project Description: No project imported.</p>
                </div>
            );
        }

        return (
            <div>
                <p>Project Description:</p>
                <p>Documentation: 
                    <a href={this.documentationLink}> {this.documentationLink}</a>
                </p>
            </div>            
        )
    }
}

export default Project;