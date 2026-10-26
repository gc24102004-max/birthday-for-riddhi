# Riddhi ka Birthday Surprise (v2, cinematic)

Birthday: **16 November 2026**. Plain HTML, CSS, JavaScript. Koi install nahi, koi backend nahi. 14 alag pages.

## 1. Kya kya hai

| Page | Kya dikhta hai |
|---|---|
| `index.html` | "For Riddhaa…" + **Enter My Little World** |
| `countdown.html` | glass countdown, zero hote hi birthday reveal (16, November, RIDDHI, Happy Birthday) |
| `childhood.html` | bachpan ki photo full screen |
| `message.html` | text-only: "1 new message…" |
| `versions.html` | Riddhi, Riddhaa, Riddhuuu, BAKA (naam badalta hai) |
| `riddhaa.html` | traditional photos, burgundy aur gold |
| `favourite.html` | sirf ek photo, koi buttons nahi |
| `little-things.html` | floating Polaroid cards |
| `sukh-dukh.html` | minimal chapter |
| `sukoon.html` | MY SUKOON |
| `confess.html` | chhota confession (tap karo) |
| `always-us.html` | stars + "Always us" |
| `letter.html` | final letter, scroll karke padhna |
| `end.html` | last screen, music fade out |

Kaise chalta hai: har chapter apne aap aage badhta hai (padhne layak time ke saath).
**Tap right = aage, tap left = peeche, swipe, ya ungli rakh ke hold = pause.** Upar ☰ se kisi bhi chapter par ja sakte ho.

## 2. Sirf ek file edit karni hai: `js/data.js`

Saare messages, photo ke naam, music, aur LOCK switch usi me hain. Sirf "quotes" ke beech ka text badlo, comma aur brackets mat chhedo. Gujarati, Hindi, English, emoji sab chalega.

### Photo kis jagah (assets/images/)
Photo ka naam badalna ho to `data.js` me `src: IMG + "memory-02.jpg"` wali line badlo.
`focus: "50% 25%"` = photo ka kaunsa hissa dikhe (x% y%). Chehra kat raha ho to y% kam karo (jaise 15%).

## 2b. Speed (kitna tez chale)

`js/data.js` me `SETTINGS` ke andar `pace: 0.6`. Ye text, photo badalna aur birthday reveal, sab ki speed ek saath badalta hai.
`1.0` = bahut dheere, `0.6` = theek (abhi), `0.5` = tez, `0.4` = bahut tez. Tap karke hamesha turant aage ja sakte ho.

## 3. Test mode aur LOCK (important)

`js/data.js` me:
```js
const LOCK_UNTIL_BIRTHDAY = false;   // abhi testing: sab khula hai
```
- **false (abhi)**: countdown page par "Countdown skip karke seedha aage" link dikhta hai, sab chapters khulte hain.
- **true (final)**: birthday se pehle sirf opening aur countdown page khulte hain. Baaki pages seedha link se kholo to bhi wapas countdown par bhej diye jate hain. Menu aur test links gayab ho jate hain. Countdown zero hote hi reveal chalta hai aur **Open Your Surprise** se story khulti hai.

Lock lagane se pehle **countdown test karo**: `countdown.html` kholo (computer par neeche Test panel dikhta hai):
1. *Countdown ke last 15 second* — live zero hote dekho, music apne aap badlega.
2. *Birthday shuru (reveal dekho)* — seedha reveal.
3. *Asli time par wapas*.

Phone par ya published link par test karna ho to address ke end me lagao:
`countdown.html?now=2026-11-15T23:59:45` (15 second pehle, clock chalta rehta hai) ya `?now=off` (asli time).
Final me ye `?now=` trick published site par bhi chalegi: koi jaanta ho to jaldi khol sakta hai. Ye security nahi hai.

**Final karne ke steps:** (1) `BIRTHDAY_DATE` sahi hai? (2) `LOCK_UNTIL_BIRTHDAY = true` (3) `data.js` GitHub par upload (4) phone par `?now=off` ke saath test.

## 4. Music

`assets/audio/` me do mp3 daalo (jinka permission aapke paas ho):
- `countdown-song.mp3` — birthday se pehle (countdown ke time).
- `birthday-song.mp3` — countdown khatam hote hi apne aap shuru.

Ek ho to wahi dono jagah chalega. Dono nahi to music button hi nahi aata.
**Sound pehle tap par shuru hota hai** (phone/browser bina tap ke sound nahi chalne dete). Uske baad har page par wahin se chalta rehta hai. Har chapter ka volume alag hai (`level` in `PAGES`): favourite par bahut halka, birthday reveal par tez. Upar ♪ button se pause/play.

## 5. GitHub par update karna

1. Repository kholo. **Purani files hata do** (`memories.html`, `reasons.html`, `surprise.html`, purane `css/` aur `js/` files), warna purana kachra rehta hai.
2. **Add file → Upload files**, is folder ke andar ki sab files (`*.html`, `css`, `js`, `assets`) drag karo. Folder ke andar ki cheezein drag karo, taki `index.html` sabse upar rahe.
3. **Commit changes**, 1–2 minute ruko, refresh karo (phone par private tab me kholo).
Chhoti update (jaise sirf messages): sirf `js/data.js` replace karo.

Privacy: published site public hoti hai. Link jaanne wala koi bhi kholsakta hai, photos ka address bhi mil sakta hai. Pages par "noindex" hai (search engine se hatane ki request), par ye security nahi hai.

## 6. Phone checklist

- [ ] Opening: Enter dabane par blur transition, music pehle tap par shuru.
- [ ] Countdown chalta hai; Test panel se last 15 second dekho; reveal aur birthday song.
- [ ] Har chapter me text kat nahi raha, photo me chehra theek dikh raha hai.
- [ ] Tap, swipe, hold-pause kaam karte hain.
- [ ] Favourite page par koi buttons nahi, par ♪ button hai.
- [ ] Letter scroll karke padhna aasan hai.
- [ ] LOCK `true` karne ke baad: seedha `childhood.html` kholne par countdown par wapas aata hai.

## 7. Technical notes

- Fonts Google Fonts se aate hain (internet par); na aaye to system fonts chalte hain.
- `prefers-reduced-motion` on ho to kuch apne aap aage nahi badhta, animations band, text turant dikhta hai.
- `sessionStorage` sirf music ki position, pause aur test-clock yaad rakhne ke liye hai; na mile to bhi site chalti hai.
- Photos web ke liye chhoti kar di gayi hain (kul ~4.8 MB). `memory-13` se "Meta AI" watermark crop kiya gaya hai.
