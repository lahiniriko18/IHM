# Projet IHM
# Gestion d'emploi du temps d'un etablissement de l'UF

Ce projet est une application web pour la gestion d'emploi du temps d'un etablissement de l'UF.
C'est une projet scolaire du matière IHM au niveau L3 au sein de l'Ecole Nationale d'Informatique
developpé en React pour le Frontend et Django pour le Backend.


# Structure du projet
IHM
    Backend
    Frontend
    .gitignore
    README.md


# Installation

### 1. Cloner le projet
```bash
git clone https://github.com/Lahy00/IHM.git
cd IHM

cd Backend
python -m venv env
source env/bin/activate  # ou `env\Scripts\activate` sur Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

cd..
cd Frontend
npm install
npm run dev