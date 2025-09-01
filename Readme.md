
# Recomp CLI

A simple and fast command-line tool to generate boilerplate for React components, contexts, and hooks using **TypeScript**.

---

## 🚀 Installation

Install the package globally using **npm**:

```bash
npm install -g recomp-cli
````

---

## 📦 Usage

Once installed, you can use the `recomp` command in your terminal.
The basic structure of a command is:

```bash
recomp gen <type> <name> [directory] [flags]
```

* `<type>`: The type of file to generate. Must be **component**, **context**, or **hook**.
* `<name>`: The name for your generator (e.g., `user-profile` or `use-toggle`).
* `[directory]`: An optional directory to create the files in. Each type has a default location.
* `[flags]`: Optional flags to skip generating certain files.

---

## ⚛️ Generate a Component

Generates a new React component.
The folder and file names will be in **PascalCase**.

**Command:**

```bash
recomp gen component <component-name>
```

**Example:**

```bash
recomp gen component user-profile
```

This will create a `UserProfile` component in `./src/components/UserProfile`.

**Generated File Structure:**

```
src/
└── components/
    └── UserProfile/
        ├── index.ts
        ├── UserProfile.module.css
        ├── UserProfile.types.ts
        └── UserProfile.tsx
```

---

## 🌐 Generate a Context

Generates a new React context, provider, and consumer hook.
The folder name will be in the format `{Name}Context`.

**Command:**

```bash
recomp gen context <context-name>
```

**Example:**

```bash
recomp gen context user-settings
```

This will create a `UserSettings` context in `./src/contexts/UserSettingsContext`.

**Generated File Structure:**

```
src/
└── contexts/
    └── UserSettingsContext/
        ├── index.ts
        ├── UserSettingsContext.types.ts
        └── UserSettingsContext.tsx
```

---

## 🔗 Generate a Hook

Generates a new React hook.
The folder name will be in the format `{Name}Hook` and the hook file will be `use{Name}.ts`.

**Command:**

```bash
recomp gen hook <hook-name>
```

**Example:**

```bash
recomp gen hook use-toggle
```

This will create a `useToggle` hook in `./src/hooks/ToggleHook`.

**Generated File Structure:**

```
src/
└── hooks/
    └── ToggleHook/
        ├── index.ts
        ├── useToggle.types.ts
        └── useToggle.ts
```

---

## ⚙️ Flags & Options

You can customize the generated output by using flags:

| Flag         | Description                                | Applies To               |
| ------------ | ------------------------------------------ | ------------------------ |
| `--no-types` | Skips creating the `.types.ts` file.       | component, context, hook |
| `--no-css`   | Skips creating the `.module.css` file.     | component                |
| `--no-index` | Skips creating the `index.ts` barrel file. | component, context, hook |
| `--no-all`   | Skips creating all optional files.         | component, context, hook |
| `-h, --help` | Shows the help message.                    | N/A                      |

**Example with flags:**

Generate a hook named `debounce` without a types file:

```bash
recomp gen hook debounce --no-types
```

---

## 📜 License

This project is licensed under the **MIT License**.

