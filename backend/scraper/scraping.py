import json
from pathlib import Path
from django.db.models import Q
from scraper.models import Quote

def scrape_quotes():
    """
    Scrape les quotes depuis le fichier 'quotes.json'
    Le texte est obligatoire, les tags et auteurs sont optionnels
    """
    quotes_data = []
    file_path = Path(__file__).parent.parent.parent / 'quotes.json'
    
    if not file_path.exists():
        raise FileNotFoundError("Le fichier 'quotes.json' n'existe pas")
    
    # Lire le fichier JSON
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        
    # Si c'est une liste directe
    if isinstance(data, list):
        quotes_data = data
    # Si c'est un objet avec une clé 'quotes'
    elif isinstance(data, dict) and 'quotes' in data:
        quotes_data = data['quotes']
    else:
        raise ValueError("Format JSON invalide - attendu une liste ou un objet avec clé 'quotes'")
    
    print(f"Nombre de citations trouvées: {len(quotes_data)}")
    
    # Maintenant, sauvegardons les données dans la base de données
    count = 0
    for quote_data in quotes_data:
        # Vérifier que le texte existe (obligatoire)
        if not quote_data.get('text') or not quote_data['text'].strip():
            print(f"Citation ignorée - texte manquant: {quote_data}")
            continue
        
        # Vérifier si la citation existe déjà
        existing_quote = Quote.objects.filter(
            text=quote_data['text'],
            author=quote_data.get('author', '')
        ).first()
        
        if not existing_quote:
            Quote.objects.create(
                text=quote_data['text'],
                author=quote_data.get('author', ''),
                tags=quote_data.get('tags', '')
            )
            count += 1
            print(f"Citation ajoutée: {quote_data['text'][:30]}...")
    
    return len(quotes_data)