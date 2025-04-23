from playwright.sync_api import sync_playwright
from django.db.models import Q
from asgiref.sync import sync_to_async
from scraper.models import Quote

def scrape_quotes():
    quotes_data = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)  # True pour production
        page = browser.new_page()
        page.goto("https://quotes.toscrape.com/js/")
        
        # Attendre que le contenu soit chargé
        page.wait_for_selector(".quote")
        
        quotes = page.query_selector_all(".quote")
        print(f"Nombre de citations trouvées: {len(quotes)}")
        
        for quote in quotes:
            text = quote.query_selector(".text").inner_text()
            author = quote.query_selector(".author").inner_text()
            tags = ", ".join([tag.inner_text() for tag in quote.query_selector_all(".tag")])
            
            # Stocker les données pour les traiter après avoir fermé Playwright
            quotes_data.append({
                'text': text,
                'author': author,
                'tags': tags
            })
            
        browser.close()
    
    # Maintenant, sauvegardons les données dans la base de données
    count = 0
    for quote_data in quotes_data:
        # Vérifier si la citation existe déjà
        existing_quote = Quote.objects.filter(
            text=quote_data['text'],
            author=quote_data['author']
        ).first()
        
        if not existing_quote:
            Quote.objects.create(
                text=quote_data['text'],
                author=quote_data['author'],
                tags=quote_data['tags']
            )
            count += 1
            print(f"Citation ajoutée: {quote_data['text'][:30]}...")
    
    return len(quotes_data)