# Quinn QA workflow: Automate
name: qa-automate
description: "Generate tests quickly for existing features using standard test patterns"
author: "BMad"

# Critical variables from config
config_source: "{project-root}/_bmad/bmm/config.yaml"
output_folder: "{config_source}:output_folder"
implementation_artifacts: "{config_source}:implementation_artifacts"
user_name: "{config_source}:user_name"
communication_language: "{config_source}:communication_language"
document_output_language: "{config_source}:document_output_language"
date: system-generated

# Workflow components
installed_path: "{project-root}/_bmad/bmm/workflows/qa/automate"
instructions: "{installed_path}/instructions.md"
validation: "{installed_path}/checklist.md"
template: false

# Variables and inputs
variables:
  # Directory paths
  test_dir: "{project-root}/tests" # Root test directory
  source_dir: "{project-root}" # Source code directory

# Output configuration
default_output_file: "{implementation_artifacts}/tests/test-summary.md"

# Required tools
required_tools:
  - read_file # Read source code and existing tests
  - write_file # Create test files
  - create_directory # Create test directories
  - list_files # Discover features
  - search_repo # Find patterns
  - glob # Find files

tags:
  - qa
  - automation
  - testing

execution_hints:
  interactive: false
  autonomous: true
  iterative: false
