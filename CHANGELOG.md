## 1.1.3 — 27/11/2026

- **Objets en double** (4 marteaux, 3 ampoules dans la meme piece) : la synchro ne rallume
  plus les copies reservees aux quetes, ni ne rapproche un objet du meme type.
- **Tout se refermait** quand l'autre joueur reapparaissait, mourait ou revenait : apres une
  arrestation on remet l'etat connu des meubles au lieu d'annoncer le reset du jeu, et l'invite
  n'impose plus sa disposition complete.
- **Compteur LUI x/3** : le nombre d'arrestations voyage avec l'etat du joueur, il ne peut plus
  rester bloque a 0.
- **« Tu as attrape l'autre joueur » a tort** : il faut que le papa soit vraiment sur l'invite
  et nettement plus loin de toi.
- **Clics a travers le menu** : un voile invisible au-dessus du jeu avale les clics tant que le
  menu est ouvert.
- **Skin maman / papa (RP)** : le vrai parent disparait et ne peut plus t'arreter tant qu'un
  joueur porte ce skin.
## 1.1.2 — 27/11/2026

- **Connexion au salon qui bouclait sur « essai 1, 2, 3... »** : sur certains telephones, le
  magasin de certificats ne reconnait pas la chaine presentee par Cloudflare ; le mod la refusait
  et retentait sans fin. Il accepte maintenant la chaine publique (le nom d'hote reste verifie)
  quand la racine epinglee est absente.
- Le statut du salon affiche l'erreur exacte du relais : on voit enfin si c'est le reseau,
  les certificats ou le code du salon.
# Journal des versions

## 1.1.1 — 27/11/2026

### Corrigé
- **Tous les tiroirs se refermaient quand quelqu'un respawn** (arrestation, fin de
  quête qui renvoie dans la chambre). Après une arrestation, le mod relançait la
  manche au bout de 3 s : ça rechargeait le niveau et remettait tous les meubles à
  zéro, chez les deux joueurs. Il laisse maintenant le jeu renvoyer le joueur dans sa
  chambre sans rien recharger. Un filet de sécurité ne relance plus qu'au bout de 7 s,
  et seulement si le joueur n'a pas bougé (vraiment bloqué).
- **Respawn sans refermer les tiroirs du copain** : pendant 2,5 s après une
  réapparition, le mod n'envoie plus l'état des portes/tiroirs (le jeu peut les
  remettre à zéro) puis se resynchronise en silence, au lieu de propager la remise à zéro.
- **Fin de quête / téléportation** : une téléportation de plus de 15 m (retour dans la chambre)
  déclenche la même mise en pause de 2,5 s, donc les meubles ne se referment pas non plus
  dans ce cas.

## 1.1.0 — 27/11/2026

### Corrigé
- **L'invité ne peut plus lancer une partie tout seul.** S'il essaie, l'écran
  « EN ATTENTE DE L'HÔTE » s'affiche (plus d'écran noir) et la partie démarre
  dès que l'hôte la lance.
- **Rejoindre une partie déjà en cours** fait entrer l'invité directement dans
  la partie de l'hôte (l'hôte renvoie l'ordre de démarrage à la connexion).
- **Recommencer** relance la manche des deux côtés sans repasser par le menu et
  sans blocage de démarrage côté invité (le drapeau « l'hôte a lancé » reste vrai après un
  redémarrage, sinon le moteur refusait le démarrage automatique).
- **Ordre de démarrage perdu** : si l'ordre de l'hôte arrivait avant le chargement de la scène,
  l'invité restait bloqué. Le mod réessaie maintenant toutes les secondes pendant 25 s.
- **Deux hôtes en même temps** (le plus gros bug) : si le deuxième joueur demandait « créer », le relais
  lui répondait correctement « tu es l'invité » mais le mod gardait « hôte ». Les deux croyaient
  commander : portes qui clignotent, objets en double, parents qui sautent. Le mod suit maintenant
  le rôle décidé par le relais (premier arrivé = hôte) et prévient « ce salon existait déjà : tu es
  l'invité ».
- **Corps de l'autre joueur dans la caméra** : quand les deux joueurs sont au même endroit, son modèle
  remplissait l'écran. Il est masqué à moins de 85 cm et réapparaît dès qu'on s'écarte.
- **Jeu figé quand la fenêtre perd le focus** (PC) : `Application.runInBackground = true`, l'hôte
  continue de simuler même s'il regarde ailleurs.
- **Bruit d'objets** : l'invité n'envoie plus l'état de ses portes/interrupteurs
  pendant les chargements (l'état de l'hôte fait foi). Les changements d'objets
  ne partent que pour ce qui est proche de l'invité et une fois la partie lancée.
- **Objets qui flottaient en l'air** : quand un objet reposé réapparaissait, il était détaché de son
  tiroir/étagère (`SetParent(null)`). Il retourne maintenant dans son parent d'origine et à sa
  position locale exacte (les vrais lâchers au sol, à plus de 1,5 m, sont conservés).
- **Changement d'état perdu** côté invité : le test de proximité (6 m) marquait l'objet comme « connu »
  avant de renoncer à l'envoyer, si bien que le changement n'arrivait jamais. Le test passe avant.
- **Rôles collants** : le relais ne peut plus inverser hôte/invité en cas de
  reconnexion (intention de rôle `want=host|peer` + reconnexion infinie).
- Correctif `IsOnline` après reconnexion (les paquets ne mouraient plus).

### Nouveau
- Interface mobile entièrement redessinée : onglets SALON / WI-FI / JOUEUR /
  RÉGLAGES, cartes, pavé numérique, badge d'état, hauteur de panneau animée.
- Interface PC alignée sur le design mobile (mêmes couleurs, mêmes cartes,
  onglets, HUD, chat, mode spectateur, toasts).
- HUD : pastille d'état, code du salon, ping, compteur 1/3 des deux joueurs.
- Écran d'attente animé côté invité, avec bouton QUITTER.
- Bannière d'attrape « 1/3 … 3/3 » et bannière « C'EST REPARTI ! ».
- Libellé de version visible dans le menu (v1.1).

## 1.0.0 — version test→publiable

- Avatar animé du joueur distant (clone du vrai modèle, skin + pseudo).
- Position exacte : protocole basé sur la hauteur des pieds, calage des semelles sur le sol.
- L'avatar distant est fantôme (aucun collider) : il ne bloque plus les parents.
- Seul l'hôte démarre la partie ; l'invité suit (événement réseau dédié).
- Recommencer relance une manche immédiatement des deux côtés (plus de retour au lobby).
- Compteur d'attrapes 1/3, mode spectateur après 3 attrapes, bouton RECOMMENCER.
- Même partie : envoi de la disposition complète des objets (position + état ouvert/fermé),
  les objets restent attachés à leur tiroir/placard.
- Repli par type d'objet si un identifiant n'existe pas côté invité.
- Synchronisation en direct des portes, tiroirs et objets tenus.
- Animation de crouch transmise (détection automatique du paramètre d'animator).
- Reconnexion automatique au relais (10 tentatives).
- Capture d'écran de bug : F2 (PC), bouton du menu (Android).
- Chat entre joueurs.