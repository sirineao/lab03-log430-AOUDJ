# lab_02_log430_Aoudj - Cash Register App

## Instruction pour lancer le projet

1. Cloner le projet avec le lien https du repo: `git clone https://github.com/sirineao/LAB02_LOG430_AOUDJ.git`
2. `cd LAB02_LOG430_AOUDJ`
3. Pour tester l'application il faut faire `docker compose up --build`.
4. Puis on peut aller sur http://localhost:3000 et tester les routes.

## Fonctionnement de la pipeline

La pipeline s'execute a chaque push sur la branche main. Les etapes suivantes sont execute:

1. Lint:  verifie la syntaxe et la qualite du code.
2. Tests unitaires Jest: test le bon fonctionnement du code.
3. Build: construit une image Docker
4. Publication sur Docker Hub





