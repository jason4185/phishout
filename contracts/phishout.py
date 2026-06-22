# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
from dataclasses import dataclass
import json


GOPLUS_ENDPOINT = "https://api.gopluslabs.io/api/v1/phishing_site"


@allow_storage
@dataclass
class PhishResult:
    phishing_site: u8   # 0 or 1


class Phishout(gl.Contract):
    results: TreeMap[str, PhishResult]

    def __init__(self):
        pass

    @gl.public.write
    def check_url(self, url: str) -> int:
        value = self._fetch_phishing_status(url)
        self.results[url] = PhishResult(u8(value))
        return value

    @gl.public.view
    def get_storage(self, url: str) -> int:
        cached = self.results.get(url, None)
        if cached is None:
            return -1
        return cached.phishing_site

    def _fetch_phishing_status(self, url: str) -> int:
        def leader_fn():
            endpoint = f"{GOPLUS_ENDPOINT}?url={url}"
            response = gl.nondet.web.get(endpoint)
            data = json.loads(response.body)

            phishing_site = data["result"]["phishing_site"]
            if not isinstance(phishing_site, int):
                raise gl.vm.UserError(
                    f"unexpected phishing_site type: {type(phishing_site)}"
                )

            return json.dumps({"phishing_site": phishing_site}, sort_keys=True)

        raw = gl.eq_principle.strict_eq(leader_fn)
        parsed = json.loads(raw)
        return parsed["phishing_site"]
