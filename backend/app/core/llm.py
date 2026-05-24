import httpx
from typing import Dict, Any, Optional, List
from app.core.config import settings

class FailoverLLMEngine:
    """
    State-of-the-art Failover LLM Engine.
    Executes chat completions against Primary (Groq) and falls back automatically
    to Backup (OpenRouter) in case of any API error, timeout, or rate limit.
    """
    
    @staticmethod
    async def get_completion(
        messages: List[Dict[str, str]], 
        temperature: float = 0.7,
        mock_fallback: str = "Mock response from ZETA LLM Engine"
    ) -> str:
        """
        Fetches LLM completion with automatic failover recovery.
        """
        # 1. Zero-key/Mock mode
        if settings.USE_MOCK_LLM:
            print("[LLM Engine] Running in Mock Mode. Returning deterministic fallback.")
            return mock_fallback

        # 2. Try Primary: Groq API
        if settings.GROQ_API_KEY:
            try:
                print(f"[LLM Engine] Trying Primary Provider (Groq) with model: {settings.GROQ_MODEL}...")
                async with httpx.AsyncClient(timeout=10.0) as client:
                    headers = {
                        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                        "Content-Type": "application/json"
                    }
                    payload = {
                        "model": settings.GROQ_MODEL,
                        "messages": messages,
                        "temperature": temperature
                    }
                    response = await client.post(
                        "https://api.groq.com/openai/v1/chat/completions",
                        json=payload,
                        headers=headers
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        result = data["choices"][0]["message"]["content"]
                        print("[LLM Engine] Primary call succeeded!")
                        return result
                    else:
                        print(f"[LLM Engine] Primary (Groq) failed with status {response.status_code}: {response.text}")
            except Exception as e:
                print(f"[LLM Engine] Primary (Groq) encountered exception: {e}")
        else:
            print("[LLM Engine] Groq API key is missing. Skipping primary.")

        # 3. Fallback: OpenRouter API
        if settings.OPENROUTER_API_KEY:
            try:
                print(f"[LLM Engine] Initiating Fallback Provider (OpenRouter) with model: {settings.OPENROUTER_MODEL}...")
                async with httpx.AsyncClient(timeout=10.0) as client:
                    headers = {
                        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://zeta.ai", # Required by OpenRouter
                        "X-Title": "ZETA Autonomous OS"
                    }
                    payload = {
                        "model": settings.OPENROUTER_MODEL,
                        "messages": messages,
                        "temperature": temperature
                    }
                    response = await client.post(
                        f"{settings.OPENROUTER_BASE_URL}/chat/completions",
                        json=payload,
                        headers=headers
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        result = data["choices"][0]["message"]["content"]
                        print("[LLM Engine] Fallback (OpenRouter) succeeded!")
                        return result
                    else:
                        print(f"[LLM Engine] Fallback (OpenRouter) failed with status {response.status_code}: {response.text}")
            except Exception as e:
                print(f"[LLM Engine] Fallback (OpenRouter) encountered exception: {e}")
        else:
            print("[LLM Engine] OpenRouter API key is missing. Skipping fallback.")

        # 4. Emergency Last Resort
        print("[LLM Engine] All API providers failed! Using Mock Fallback as safety net.")
        return mock_fallback
