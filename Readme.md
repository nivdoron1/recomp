Recomp CLI
A simple and fast command-line tool to generate boilerplate for React components using TypeScript and CSS Modules.

Installation
Install the package globally using npm:

```bash
npm install -g recomp-cli
```

Usage
Once installed, you can use the recomp command in your terminal.

Generate a Component
To generate a new component, use the gen command:

```bash
recomp gen <component-name> [directory]
```

<component-name>: The name of your component (e.g., user-profile).

[directory]: An optional directory to create the component in. Defaults to ./src/components.

Example
This command will create a UserProfile component in ./src/components/user-profile.

```bash
recomp gen user-profile
```

The following file structure will be created:

```
src/
└── components/
└── user-profile/
├── index.ts
├── UserProfile.module.css
└── UserProfile.tsx
```

License
This project is licensed under the MIT License.
