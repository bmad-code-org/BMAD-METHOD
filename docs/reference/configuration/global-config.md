# Core Module Global Inheritable Config

The Core Modules module.yaml file defines configuration values that are useful and unique for all other modules to utilize, and by default all other modules installed will clone the values defined in the core module yaml.config into their own. It is possible for other modules to override these values, but the general intent it to accept the core module values and define their own values as needed, or extend the core values.

Currently, the core module.yaml config will define (asking the user upon installation, and recording to the core module config.yaml):
- `user_name`: string (defaults to the system defined user name)
- `communication_language`: string (defaults to english)
- `document_output_language`: string (defaults to english)
- `output_folder`: string (default `_bmad-output`)

An example of extending one of these values, in the BMad Method module.yaml it defines a planning_artifacts config, which will default to `default: "{output_folder}/planning-artifacts"` thus whatever the output_folder will be, this extended versions default will use the value from this core module and append a new folder onto it. The user can choose to replace this without utilizing the output_folder from the core if they so chose.
