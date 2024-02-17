import unittest

from component_builder import build_component_of_type_from_raw_text, identify_component_type_from_raw_text
from component_types import ComponentType

class TestComponentClassifier(unittest.TestCase):
    def test_difficulties_classification(self):
        raw_text = "The component title is test_difficulties. The first difficulty is DIFFICULTY_1. One possible solution for this issue SOLUTION_1. Another possible solution SOLUTION_2. Another difficulty is DIFFICULTY_2. A possible solution for DIFFICULTY_2 is SOLUTION_3."
        component_dict = build_component_of_type_from_raw_text(str(ComponentType.DIFFICULTIES), raw_text)

        self.assertIn("test_difficulties", component_dict["componentName"])

        self.assertEqual(2, len(component_dict["difficulties"]))

        difficulty_one = component_dict["difficulties"][0]
        self.assertIn("DIFFICULTY_1", difficulty_one["difficultyDescription"])
        self.assertEqual(2, len(difficulty_one["possibleSolutions"]))
        self.assertIn("SOLUTION_1", difficulty_one["possibleSolutions"][0])
        self.assertIn("SOLUTION_2", difficulty_one["possibleSolutions"][1])
        
        difficulty_two = component_dict["difficulties"][1]
        self.assertIn("DIFFICULTY_2", difficulty_two["difficultyDescription"])
        self.assertEqual(1, len(difficulty_two["possibleSolutions"]))
        self.assertIn("SOLUTION_3", difficulty_two["possibleSolutions"][0])

    def test_software_repo_classification(self):
        raw_text = "The component title is test_software_repo. The code will be stored in a repo called TEST_REPO. A code sample for a file called test_file.py in python is: def func_name(foo):."
        component_dict = build_component_of_type_from_raw_text(str(ComponentType.SOFTWARE_REPO), raw_text)

        self.assertIn("test_software_repo", component_dict["componentName"])

        self.assertEqual(1, len(component_dict["codeSamples"]))

        code_sample_one = component_dict["codeSamples"][0]

        self.assertIn("test_file.py", code_sample_one["title"])
        self.assertIn("python", code_sample_one["language"])
        self.assertIn("test_software_repo", code_sample_one["def func_name(foo):"])

    def test_todo_classification(self):
        raw_text = "The component title is test_todo. The following items need to be completed: ITEM_1, ITEM_2, ITEM_3."
        component_dict = build_component_of_type_from_raw_text(str(ComponentType.TODO), raw_text)

        self.assertIn("test_todo", component_dict["componentName"])

        self.assertEqual(3, len(component_dict["items"]))
        self.assertIn("ITEM_1", component_dict["items"][0])
        self.assertIn("ITEM_2", component_dict["items"][1])
        self.assertIn("ITEM_3", component_dict["items"][2])

    def test_use_cases_classification(self):
        raw_text = "The component title is test_use_cases. The start operating wall for the component is START_OPERATING WALL. The end operating wall is END_OPERATING_WALL. Some use cases are USE_CASE_1, USE_CASE_2, and USE_CASE_3."
        component_dict = build_component_of_type_from_raw_text(str(ComponentType.USE_CASES), raw_text)

        self.assertIn("test_use_cases", component_dict["componentName"])

        self.assertIn("START_OPERATING", component_dict["startOperatingWall"])
        self.assertIn("END_OPERATING_WALL", component_dict["endOperatingWall"])

        self.assertEqual(3, len(component_dict["useCases"]))
        self.assertIn("USE_CASE_1", component_dict["useCases"][0])
        self.assertIn("USE_CASE_2", component_dict["useCases"][1])
        self.assertIn("USE_CASE_3", component_dict["useCases"][2])

    def test_component_description_classification(self):
        raw_text = "The component title is test_component_description. The end goal is END_GOAL_1 and the mission statement is MISSION_STATEMENT_1."
        component_dict = build_component_of_type_from_raw_text(str(ComponentType.COMPONENT_DESCRIPTION), raw_text)

        self.assertIn("test_component_description", component_dict["componentName"])

        self.assertIn("END_GOAL_1", component_dict["endGoal"])
        self.assertIn("MISSION_STATEMENT_1", component_dict["missionStatement"])

    def test_documentation_section_classification(self):
        raw_text = "The component title is test_documentation_section. This is a sample documentation section. Some text here. And some more here."
        component_dict = build_component_of_type_from_raw_text(str(ComponentType.DOCUMENTATION_SECTION), raw_text)

        self.assertIn("test_documentation_section", component_dict["componentName"])

        self.assertIn("This is a sample documentation section. Some text here. And some more here.", component_dict["endGoal"])

    def test_nested_component_classification(self):
        raw_text = "The following items need to be completed: ITEM_1, ITEM_2, ITEM_3. The end goal is END_GOAL_1 and the mission statement is MISSION_STATEMENT_1."
        self.assertEqual(str(ComponentType.NESTED_COMPONENT), identify_component_type_from_raw_text(raw_text))

if __name__ == '__main__':
    unittest.main()