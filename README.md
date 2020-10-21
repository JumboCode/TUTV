# TUTV

## Contributors
Current:
* Project Manager: Frank Ma
* Designer: Emai Lai
* Developer:[Xenia Rudchenko](https://github.com/XeniaRud)

2019-2020:
* Project Manager: Deepanshu Utkarsh
* Developer: Luke Taylor
* Developer: Alon Jacobson
* Developer: Isabella Urdahl
* Developer: Daeseob Lim

## Setup

### Before you begin:

 - Please feel free to ask questions about how to go through these steps.
   These instructions aren't intended to tell you exactly what to do, nor
   are they intended to throw you in the water. You *will* be doing some
   Googling to figure some of these setup steps out. If you get stuck, ask
   for help!

 - If you don't know a word or a phrase, try and figure out what it means.
   Once you find out, add it to the glossary at the bottom of this README
   so others who have the same question can just look at the glossary.

### Windows users!!
To ensure consistency in our workflows with Mac and Linux users, you will
need to install the Windows Subsystem for Linux (WSL) before you try the
setup instructions. Try installing it on your own if you don't have it!

### Steps
 1. Clone this repository. `git clone
    https://github.com/JumboCode/TUTV.git` in your shell or your favorite
    Git client. I recommend [Gitkraken](https://www.gitkraken.com/). If you
    do not have `git` installed, try and figure out how to install it on
    your computer.

 2. Install Python dependencies. `pipenv install`. If you don't have
    `pipenv`, try and figure out how to install it. Google 'how to install
    pipenv mac' or 'pipenv WSL' or 'ubuntu pipenv', depending on your OS.
    Learning how to install a missing dependency is a good skill to learn!

 3. Install React dependencies. `cd client` and then, `yarn install`. If
    you don't have `yarn`, figure out how to install it! Feel free to ask
    questions about preferred methods, etc.
   
 4. You need a `.env` file in the project root for the server to work
    properly. Reach out to me about the content of this file.

## Starting Local Development
 1. In the project root, start your [virtual
    environment](https://realpython.com/pipenv-guide/) shell: `pipenv
    shell`.
 2. Start the Django development server. `cd server` and `./manage.py
    runserver`. You may see a red error message in your terminal at this
    point. Try and fix the error on your own. If you get stuck, ask for
    help!

 3. Open a new tab/window in your terminal, with the repository root as
    your working directory. Start the frontend development server in this
    tab: `cd client` and then, `yarn start`.

 4. The previous step should have opened
    [http://127.0.0.1:3000](http://127.0.0.1:3000) in a browser window. If
    not, you can click on the link above.

## Project workflow

We are going to develop this section as a team as our project progresses.
Here's a tentative overview of how our design and development process will
look like:

 - Design docs (yes), both visual and technical, will go in the [project
   wiki](https://github.com/JumboCode/TUTV/wiki). Do you have an idea for a
   wiki page? Add it!

 - Everyone will contribute to keeping our wiki and our README up to date.

 - We will create one branch per issue, and create pull requests to
   `master` for code reviews. Once code is reviewed, your branch will be
   merged into `dev` and deleted. 

 - We will be using Discord for communication. You will be invited soon, if you
   haven't already.

 - We will use our weekly meetings to catch up on each other's progress,
   share what we learnt and plan what we are going to do next. Everyone
   participates. If you have anything to share to improve the quality of
   our work and our relationships with each other, do it during these
   weekly meetings! 


## References

 - For setting up React Create App with Django:
   https://www.fusionbox.com/blog/detail/create-react-app-and-django/624/
 - Most of this page was written by Deepanshu Utkarsh, with updates from
   Frank Ma. 
