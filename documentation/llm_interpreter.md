Should the terminal's model only affect the current editor context?
- No. Ideally the user should just be able to enter a stream of thought and the model will then visualize it using components.

It would be best to split the process over a few layers:
User types in terminal -> text mapped to executable commands -> visual representation updated + saved

The visual representation layer is already complete and can be expanded as needed. The next steps should be:
1. Develop the executable commands + interpreter
2. Train the model to go from natural language to executable commands
3. Add the model to the front end (should run in terminal)