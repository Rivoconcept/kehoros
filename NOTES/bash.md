docker exec -it postgres psql -U backend -d kehoros
\dt
\

curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rivo.k0949@keobiz.fr","password":"Kadmin$26"}'



tree frontend/src/app/features/forms -L 3



curl -i -X POST http://localhost:3000/forms/templates \
-H "Content-Type: application/json" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDRjZDFiZS00YTg2LTQ0MzgtYThlZi1jMmY5MTdlZDllMzIiLCJlbWFpbCI6InJpdm8uazA5NDlAa2VvYml6LmZyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg3MTIzNTQwLCJleHAiOjE3ODcxMjQ0NDB9.PWNBDNFfX_O5cCp1HXYxXi3ePWItyJlxL0MCFZ8_WrM" \
-d '{
  "title": "TEST FORMS",
  "description": "Test du builder",
  "category": "test"
}'

export TEMPLATE_ID="6fc5c180-a486-4abb-8068-f2af8cf3d750"

//CREATE QUESTION
curl -i -X POST http://localhost:3000/forms/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDRjZDFiZS00YTg2LTQ0MzgtYThlZi1jMmY5MTdlZDllMzIiLCJlbWFpbCI6InJpdm8uazA5NDlAa2VvYml6LmZyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg3MTIzNTQwLCJleHAiOjE3ODcxMjQ0NDB9.PWNBDNFfX_O5cCp1HXYxXi3ePWItyJlxL0MCFZ8_WrM" \
  -d '{
    "template_id": "'"$TEMPLATE_ID"'",
    "title": "Quel est votre nom ?",
    "description": "Question de test",
    "type": "text",
    "required": true,
    "position": 0,
    "points": 1,
    "settings": {
      "placeholder": "Entrez votre nom",
      "helpText": "Votre nom complet",
      "width": "100%"
    }
  }'

2. Créer une deuxième question

On va tester un autre type :

  curl -i -X POST http://localhost:3000/forms/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDRjZDFiZS00YTg2LTQ0MzgtYThlZi1jMmY5MTdlZDllMzIiLCJlbWFpbCI6InJpdm8uazA5NDlAa2VvYml6LmZyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg3MTIzNTQwLCJleHAiOjE3ODcxMjQ0NDB9.PWNBDNFfX_O5cCp1HXYxXi3ePWItyJlxL0MCFZ8_WrM" \
  -d '{
    "template_id": "'"$TEMPLATE_ID"'",
    "title": "Quel est votre âge ?",
    "description": "",
    "type": "number",
    "required": true,
    "position": 1,
    "points": 2,
    "settings": {
      "minValue": 18,
      "maxValue": 100,
      "placeholder": "Votre âge"
    }
  }'

3. Vérifier que le template contient bien les 2 questions

  curl -s -X GET \
  "http://localhost:3000/forms/templates/$TEMPLATE_ID" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDRjZDFiZS00YTg2LTQ0MzgtYThlZi1jMmY5MTdlZDllMzIiLCJlbWFpbCI6InJpdm8uazA5NDlAa2VvYml6LmZyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg3MTIzNTQwLCJleHAiOjE3ODcxMjQ0NDB9.PWNBDNFfX_O5cCp1HXYxXi3ePWItyJlxL0MCFZ8_WrM" | jq

4. Tester directement l'endpoint des questions
  curl -s -X GET \
  "http://localhost:3000/forms/templates/$TEMPLATE_ID/questions" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDRjZDFiZS00YTg2LTQ0MzgtYThlZi1jMmY5MTdlZDllMzIiLCJlbWFpbCI6InJpdm8uazA5NDlAa2VvYml6LmZyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg3MTIzNTQwLCJleHAiOjE3ODcxMjQ0NDB9.PWNBDNFfX_O5cCp1HXYxXi3ePWItyJlxL0MCFZ8_WrM" | jq


  5. Tester la modification d'une question

Récupère l'ID de la première question :

curl -s -X GET \
  "http://localhost:3000/forms/templates/$TEMPLATE_ID/questions" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDRjZDFiZS00YTg2LTQ0MzgtYThlZi1jMmY5MTdlZDllMzIiLCJlbWFpbCI6InJpdm8uazA5NDlAa2VvYml6LmZyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg3MTIzNTQwLCJleHAiOjE3ODcxMjQ0NDB9.PWNBDNFfX_O5cCp1HXYxXi3ePWItyJlxL0MCFZ8_WrM" | jq


  Et teste :

curl -i -X PATCH \
  "http://localhost:3000/forms/questions/$QUESTION_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDRjZDFiZS00YTg2LTQ0MzgtYThlZi1jMmY5MTdlZDllMzIiLCJlbWFpbCI6InJpdm8uazA5NDlAa2VvYml6LmZyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg3MTIzNTQwLCJleHAiOjE3ODcxMjQ0NDB9.PWNBDNFfX_O5cCp1HXYxXi3ePWItyJlxL0MCFZ8_WrM" \
  -d '{
    "title": "Quel est votre nom complet ?",
    "required": false,
    "position": 0,
    "points": 3,
    "settings": {
      "placeholder": "Prénom et nom",
      "helpText": "Modifié depuis le test API"
    }
  }'

  curl -s -X GET \
  "http://localhost:3000/forms/templates/$TEMPLATE_ID/questions" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDRjZDFiZS00YTg2LTQ0MzgtYThlZi1jMmY5MTdlZDllMzIiLCJlbWFpbCI6InJpdm8uazA5NDlAa2VvYml6LmZyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg3MTIzNTQwLCJleHAiOjE3ODcxMjQ0NDB9.PWNBDNFfX_O5cCp1HXYxXi3ePWItyJlxL0MCFZ8_WrM" | jq

  curl -i -X DELETE \
  "http://localhost:3000/forms/questions/$QUESTION_ID" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDRjZDFiZS00YTg2LTQ0MzgtYThlZi1jMmY5MTdlZDllMzIiLCJlbWFpbCI6InJpdm8uazA5NDlAa2VvYml6LmZyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg3MTIzNTQwLCJleHAiOjE3ODcxMjQ0NDB9.PWNBDNFfX_O5cCp1HXYxXi3ePWItyJlxL0MCFZ8_WrM"

  curl -s -X GET \
  "http://localhost:3000/forms/templates/$TEMPLATE_ID/questions" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDRjZDFiZS00YTg2LTQ0MzgtYThlZi1jMmY5MTdlZDllMzIiLCJlbWFpbCI6InJpdm8uazA5NDlAa2VvYml6LmZyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg3MTIzNTQwLCJleHAiOjE3ODcxMjQ0NDB9.PWNBDNFfX_O5cCp1HXYxXi3ePWItyJlxL0MCFZ8_WrM" | jq

  1. Vérifier que le template existe
curl -i \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDRjZDFiZS00YTg2LTQ0MzgtYThlZi1jMmY5MTdlZDllMzIiLCJlbWFpbCI6InJpdm8uazA5NDlAa2VvYml6LmZyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg3MTIzNTQwLCJleHAiOjE3ODcxMjQ0NDB9.PWNBDNFfX_O5cCp1HXYxXi3ePWItyJlxL0MCFZ8_WrM" \
  "http://localhost:3000/forms/templates/$TEMPLATE_ID"


curl -i -X POST \
"http://localhost:3000/forms/questions" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNDRjZDFiZS00YTg2LTQ0MzgtYThlZi1jMmY5MTdlZDllMzIiLCJlbWFpbCI6InJpdm8uazA5NDlAa2VvYml6LmZyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzg3MTIzNTQwLCJleHAiOjE3ODcxMjQ0NDB9.PWNBDNFfX_O5cCp1HXYxXi3ePWItyJlxL0MCFZ8_WrM$" \
-d '{
  "template_id": "'"$TEMPLATE_ID"'",
  "title": "Question test",
  "description": "Question créée avec curl",
  "type": "text",
  "required": true,
  "position": 0,
  "points": 1,
  "settings": {
    "placeholder": "Votre nom",
    "helpText": "Nom et prénom",
    "width": "100%",
    "hidden": false,
    "readOnly": false,
    "disabled": false
  }
}'