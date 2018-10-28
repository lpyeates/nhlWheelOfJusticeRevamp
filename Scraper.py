import requests
from bs4 import BeautifulSoup

page = request.get('http://www.nhl.com/stats/player?reportType=season&seasonFrom=20172018&seasonTo=20172018&gameType=2&filter=gamesPlayed,gte,1&sort=playerName')
soup = BeautifulSoup(page.text, 'html.parser')

