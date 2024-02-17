import unittest

from component_builder import build_component_of_type_from_raw_text, identify_component_type_from_raw_text
from component_types import ComponentType

class TestComponentClassifier(unittest.TestCase):
    def test_parent_selection_empty_project(self):
        project_structure = ProjectStructure("project_root_id")
        new_component_raw_text = "This is some text for a new component"
        parent_id = project_structure.get_parent_id_for_raw_text(new_component_raw_text)
        self.assertEqual("project_root_id", parent_id)

    def test_parent_selection_no_similar_components(self):
        project_structure = ProjectStructure("project_root_id")
        project_strucute.add_component_raw_text("project_root_id", "component_id_1", "This is a component for doing A.")
        project_strucute.add_component_raw_text("project_root_id", "component_id_2", "This is a component for doing B.")
        project_strucute.add_component_raw_text("project_root_id", "component_id_3", "This is a component for doing C.")
        new_component_raw_text = "This is a component for doing D."
        parent_id = project_structure.get_parent_id_for_raw_text(new_component_raw_text)
        self.assertEqual("project_root_id", parent_id)

    def test_parent_selection_partially_similar_component(self):
        # This one should convert a component to a nested component and add a child
        project_structure = ProjectStructure("project_root_id")
        project_strucute.add_component_raw_text("project_root_id", "component_id_1", "This is a component for doing A.")
        project_strucute.add_component_raw_text("project_root_id", "component_id_2", "This is a component for doing B.")
        project_strucute.add_component_raw_text("project_root_id", "component_id_3", "This is a component for doing C.")
        new_component_raw_text = "This component is also for B."
        parent_id = project_structure.get_parent_id_for_raw_text(new_component_raw_text)
        self.assertEqual("component_id_2", parent_id)
        self.assertEqual(2, project_structure.get_children_for_component("component_id_2"))
        self.assertEqual("This is a component for doing B.", project_structure.get_children_for_component("component_id_2")[0])
        self.assertEqual("This component is also for B.", project_structure.get_children_for_component("component_id_2")[1])

    def test_parent_selection_highly_similar_components(self):
        # This one should edit an existing component
        project_structure = ProjectStructure("project_root_id")
        project_strucute.add_component_raw_text("project_root_id", "component_id_1", "This is a component for doing A.")
        project_strucute.add_component_raw_text("project_root_id", "component_id_2", "This is a component for doing B.")
        project_strucute.add_component_raw_text("project_root_id", "component_id_3", "This is a component for doing C.")
        new_component_raw_text = "This component is also for B."
        parent_id = project_structure.get_parent_id_for_raw_text(new_component_raw_text)
        self.assertEqual("component_id_2", parent_id)

if __name__ == '__main__':
    unittest.main()