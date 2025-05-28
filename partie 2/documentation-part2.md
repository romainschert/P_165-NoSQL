# Documentation P_165

## Avant de commencer

Les deux parties n'utilisent pas les mêmes conteneurs. Pour la partie 2, supprime les conteneurs de la partie 1, puis exécute le docker-compose de la partie 2.

## 1. Restore

#### Ou ouvrir le terminal

Ouvre le terminal au même niveau que le dossier backupdb.

#### Verifier que le container a comme volume:

```bash
    volumes:
      - ./backupdb:/backupdb
```

#### Avant la commande:

```bash
docker exec -it <nom du container>
```

#### Commande:

```bash
mongorestore --gzip
 --archive=/backupdb/db_mflix.gz
 --nsInclude=db_mflix.*
 --uri="mongodb://root:admin@localhost:27017"
 --authenticationDatabase=admin
```

### Explication des paramètres

| Paramètre                                      | Description                                                                                                                                              |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mongorestore`                                 | Commande utilisée pour restaurer une base de données MongoDB.                                                                                            |
| `--gzip`                                       | Indique que le fichier à restaurer est compressé au format `.gz`.                                                                                        |
| `--archive=/backupdb/db_mflix.gz`              | Spécifie le chemin vers l’archive contenant la base à restaurer. Dans cet exemple, le fichier est situé dans `C:/Docker/P_165-NoSQL/partie 2/backupdb/`. |
| `--nsInclude=db_mflix.*`                       | Permet de restaurer uniquement les collections du namespace `db_mflix`.                                                                                  |
| `--uri="mongodb://root:admin@localhost:27017"` | Chaîne de connexion à MongoDB incluant le nom d’utilisateur, le mot de passe et l’adresse du serveur.                                                    |
| `--authenticationDatabase=admin`               | Précise que l’authentification doit être effectuée par un admin.                                                                                         |

## 2. Création des rôles personnalisés
Dans cette section, nous définissons trois rôles MongoDB adaptés aux différents niveaux d’accès nécessaires à la base db_mflix.

Toutes les commandes suivantes sont exécutées dans le shell de MongoDB Compass. Veille donc à les exécuter également dans le shell intégré à Compass, et ce, dans le contexte de la base de données db_mflix.


---

### Rôle : Gestionnaire (`gestionnaireRole`)

```js
db.createRole({
  role: "gestionnaireRole",
  privileges: [
    {
      resource: { db: "db_mflix", collection: "movies" },
      actions: ["find", "insert", "update", "remove"],
    },
    {
      resource: { db: "db_mflix", collection: "comments" },
      actions: ["find", "insert", "update", "remove"],
    },
    { resource: { db: "db_mflix", collection: "users" }, actions: ["find"] },
  ],
  roles: [],
});
```

**Droits accordés** :

- Accès complet (CRUD) aux collections `movies` et `comments`
- Accès en lecture seule à la collection `users`

---

### Rôle : Utilisateur standard (`utilisateurRole`)

```js
db.createRole({
  role: "utilisateurRole",
  privileges: [
    { resource: { db: "db_mflix", collection: "movies"}, actions: ["find"] },
    {
      resource: { db: "db_mflix", collection: "comments" },
      actions: ["insert"],
    },
  ],
  roles: [],
});,
```

**Droits accordés** :

- Lecture sur l’ensemble de la base `db_mflix`
- Possibilité d’ajouter des commentaires dans la collection `comments`

---

### Rôle : Administrateur (`adminRole`)

```js
db.createRole({
  role: "adminRole",
  privileges: [
    {
      resource: { db: "db_mflix", collection: "" },
      actions: ["find", "insert", "update", "remove"]
    },
    {
      resource: { db: "db_mflix", collection: "" },
      actions: ["createCollection", "dropCollection"]
    },
    {
      resource: { db: "db_mflix", collection: "" },
      actions: ["createIndex", "dropIndex"]
    },
    {
      resource: { db: "db_mflix", collection: "" },
      actions: ["grantRole", "revokeRole"]
    }
  ],
  roles: [
    { role: "userAdmin", db: "db_mflix" },
    { role: "dbAdmin", db: "db_mflix" }
  ]
});
```

**Droits accordés** :

- Accès total (CRUD) à toute la base
- Gestion des rôles (attribution et retrait)
- Création et suppression de collections
- Accès à deux rôles intégrés :
  - `userAdmin` : gestion des utilisateurs
  - `dbAdmin` : administration de la structure de la base (index, validation, etc.)

---

## 3. Création des utilisateurs MongoDB

Chaque utilisateur se voit attribuer un mot de passe et un rôle défini ci-dessus.

---

### Utilisateur : Administrateur

```js
db.createUser({
  user: "admin",
  pwd: "admin",
  roles: [{ role: "adminRole", db: "db_mflix" }],
});
```

**Accès** : Total sur la base `db_mflix`

---

### Utilisateur : Visiteur

```js
db.createUser({
  user: "utilisateur",
  pwd: "utilisateur",
  roles: [{ role: "utilisateurRole", db: "db_mflix" }],
});
```

**Accès** : Lecture globale et ajout de commentaires

---

### Utilisateur : Gestionnaire

```js
db.createUser({
  user: "gestionnaire",
  pwd: "gestion",
  roles: [{ role: "gestionnaireRole", db: "db_mflix" }],
});
```

**Accès** : Gestion complète des films et commentaires, lecture des utilisateurs
