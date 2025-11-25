from fastapi import APIRouter, HTTPException
import httpx
from app.core.config import settings

router = APIRouter()

@router.get("/nba")
async def get_nba_odds():
    """
    Fetch NBA odds from The Odds API.
    Proxies the request to hide the API key.
    """
    if not settings.ODDS_API_KEY:
        raise HTTPException(status_code=500, detail="Server configuration error: API Key missing")

    base_url = "https://api.the-odds-api.com/v4"
    sport = "basketball_nba"
    regions = "us"
    markets = "h2h,spreads,totals"
    odds_format = "american"
    date_format = "iso"

    url = f"{base_url}/sports/{sport}/odds"
    params = {
        "apiKey": settings.ODDS_API_KEY,
        "regions": regions,
        "markets": markets,
        "oddsFormat": odds_format,
        "dateFormat": date_format
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            # Optional: Log quota headers
            # print(f"Quota Remaining: {response.headers.get('x-requests-remaining')}")
            
            return data
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
