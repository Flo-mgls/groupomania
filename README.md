# GROUPOMANIA
**Backend et Frontend du réseau social de l'entreprise Groupomania**

***Backend:***
```
npm install
npm start
```

***Frontend:***
```
npm install
npm run serve
```

***Pour tester les fonctionnalités de l'app merci de suivre les étapes suivantes:***
- Créez un fichier nommé *.env* dans le dossier back
> back
>> app.js\
>> **.env**\
>> server.js\

Y insérer directement ces 3 variables d'environnements:\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DB_ID=adminP7\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DB_PW=P7Groupomania\
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TOKEN=Ce_que_vous_voulez

- Puis créez la base de donnée avec le fichier *createDatabse.sql*
```
SOURCE yourPath/createDatabase.sql;
```

*Enjoy*