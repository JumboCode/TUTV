# TUTV

## Prerequisites

### WSL for Windows Users

To ensure consistency in our workflows with Mac and Linux users, you will need
to install the Windows Subsystem for Linux (WSL) before you try the setup
instructions.

[Follow the instructions
here](https://docs.microsoft.com/en-us/windows/wsl/install). Use the default
distribution (Ubuntu). The oneliner should be `wsl --install`.

**Note: If you are using WSL, do the steps below in the WSL terminal. Launch the
wsl terminal either through the Windows start menu, or by typing `wsl` in
Powershell.**

### Source Control (Git)

We use `git` for version control. Install `git` by [following the instructions
here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

I personally prefer the `git` CLI along with extensions in VSCode. If you like,
you can also use a Git GUI client like GitHub Desktop, GitKraken, or SourceTree.

If this is your first time using Git, you also need to configure the name and
email associated with your commits. You can do this by running the following:

```
git config --global user.name "FIRST_NAME LAST_NAME"
git config --global user.email "MY_NAME@example.com"
```

### Python

The backend of the TUTV website is built in Python with Django. If you are on
MacOS, Python and pip should already be installed.

If you are on WSL, Python is pre-installed but pip is not. Install pip by
running the following:

```
sudo apt update && upgrade
sudo apt install python3 python3-pip ipython3
```

### Pipenv

We use `pipenv` to manage Python dependencies (external packages). Install
`pipenv` by running the following:

```
pip install --user --upgrade pipenv
```

After the installation, run `which pipenv`. If this doesn't result in an output,
run the following to add the path of the `pipenv` install folder to PATH:

```
echo 'export PATH="${HOME}/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

`.bashrc` should be replaced with the config file of whichever file you are
using. On MacOS, this might be `.zshrc`.

More instructions [can be found
here](https://pipenv.pypa.io/en/latest/install/).

### NodeJS

The frontend of the TUTV website is built in TypeScript with React, which
requires NodeJS to transpile and bundle. The most preferable way to install
NodeJS is with Node Version Manager (`nvm`), which allows NodeJS versions to be
easily switched. Install `nvm` by running the following:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
```

Then install NodeJS version 16 (**note: do not install the latest**) by running
the following:

```
nvm install node
```

### Yarn

We use `yarn` to manage JavaScript dependencies (external packages). Install
`yarn` by running the following:

```
npm install --global yarn
```

## Local Development Environment Setup

### Clone This Repository

```
git clone https://github.com/JumboCode/TUTV.git
```

### Install Python Dependencies

```
cd TUTV
pipenv install
```

This leverages the `Pipfile` and `Pipfile.lock` already present in the
repository to install the necessary dependencies to run the backend.

There might be an error with installing the `psycopg2` package. Don't worry
about this for now.

### Install React dependencies

```
yarn install
```

This leverages the `package.json` and `yarn.lock` already present in the
repository to install the necessary dependencies to run the frontend.

### Environment Variables

You need a `.env` file in the project root for the server to work properly.
Find this file in the #setup-and-workflow Discord channel. Note that this
file might've automatically been renamed to `env`; if this is the case,
rename it to `.env`.

### Populating the Database

Now we need to populate the application with some data. Run the following
command to do this:

```
pipenv shell
cd server
./manage.py makemigrations
./manage.py migrate
./manage.py loaddata fixture/fixtures_2021.json
```

## Starting Local Development

1.  In the project root, start your [virtual
    environment](https://realpython.com/pipenv-guide/) shell:

```
pipenv shell
```

2.  Start the Django development server:

```
cd server
./manage.py runserver
```

If there are any errors, it is possible that migrations have not been applied
correctly. Check if all commands in step 5 above have been run.

3.  Open a new tab/window in your terminal, with the repository root as your
    working directory. Start the frontend development server in this tab: `cd client` and then, `yarn start`.

4.  The previous step should have opened
    [http://127.0.0.1:3000](http://127.0.0.1:3000) in a browser window. If not,
    you can click on the link above.

## References

- The original version of this page was written by Deepanshu Utkarsh, which can
  be found in the git commit history.

## Contributors

Current:

- PM/Developer: [Frank Ma](https://github.com/Frama-99)
- Developer: [Aidan Barg](https://github.com/abarg12)

2020-2021

- PM/Developer: [Frank Ma](https://github.com/Frama-99)
- Designer: Emai Lai
- Developer: [Aidan Barg](https://github.com/abarg12)
- Developer: [Xenia Rudchenko](https://github.com/XeniaRud)
- Developer: [Patrick Gavazzi](https://github.com/pgavazzi1)
- Developer: [Yong Quan Tan](https://github.com/hermit46)
- Developer: [Matt Ung](https://github.com/Matt-Ung)
- Developer: Emma Bethel

2019-2020:

- Project Manager: Deepanshu Utkarsh
- Designer: Emai Lai
- Developer: Luke Taylor
- Developer: Xenia Rudchenko
- Developer: Alon Jacobson
- Developer: Frank Ma
- Developer: Isabella Urdahl
- Developer: Daeseob Lim
