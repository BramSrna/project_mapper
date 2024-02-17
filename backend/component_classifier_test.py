import unittest

from component_builder import identify_component_type_from_raw_text
from component_types import ComponentType

class TestComponentClassifier(unittest.TestCase):
    def test_difficulties_classification(self):
        raw_text = "The first difficulty is DIFFICULTY_1. One possible solution for this issue SOLUTION_1. Another possible solution SOLUTION_2. Another difficulty is DIFFICULTY_2. A possible solution for DIFFICULTY_2 is SOLUTION_3."
        self.assertEqual(str(ComponentType.DIFFICULTIES), identify_component_type_from_raw_text(raw_text))

    def test_software_repo_classification(self):
        raw_text = "The code will be stored in a repo called TEST_REPO. A code sample for a file called test_file.py in python is: def func_name(foo):."
        self.assertEqual(str(ComponentType.SOFTWARE_REPO), identify_component_type_from_raw_text(raw_text))

    def test_todo_classification(self):
        raw_text = "The following items need to be completed: ITEM_1, ITEM_2, ITEM_3."
        self.assertEqual(str(ComponentType.TODO), identify_component_type_from_raw_text(raw_text))

    def test_use_cases_classification(self):
        raw_text = "The start operating wall for the component is START_OPERATING WALL. The end operating wall is END_OPERATING_WALL. Some use cases are USE_CASE_1, USE_CASE_2, and USE_CASE_3."
        self.assertEqual(str(ComponentType.USE_CASES), identify_component_type_from_raw_text(raw_text))

    def test_component_description_classification(self):
        raw_text = "The end goal is END_GOAL_1 and the mission statement is MISSION_STATEMENT_1."
        self.assertEqual(str(ComponentType.COMPONENT_DESCRIPTION), identify_component_type_from_raw_text(raw_text))

    def test_documentation_section_classification(self):
        raw_text = "This is a sample documentation section. Some text here. And some more here."
        self.assertEqual(str(ComponentType.DOCUMENTATION_SECTION), identify_component_type_from_raw_text(raw_text))

    def test_nested_component_classification(self):
        raw_text = "The following items need to be completed: ITEM_1, ITEM_2, ITEM_3. The end goal is END_GOAL_1 and the mission statement is MISSION_STATEMENT_1."
        self.assertEqual(str(ComponentType.NESTED_COMPONENT), identify_component_type_from_raw_text(raw_text))

if __name__ == '__main__':
    unittest.main()