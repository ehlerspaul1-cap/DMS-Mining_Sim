# DMS Mining Simulator V2

## Release 1: Stable foundation

- Preserve the existing geology generator and mining canvas.
- Replace malformed page markup with responsive, semantic HTML.
- Add a guided seven-objective project sequence.
- Correct the starting budget and major economic calculation defects.
- Give working upgrades a cost and clearly label unfinished upgrades.
- Repair graph visibility and scaled-canvas interaction.
- Package the folder for staging at `/sim-v2/`.

## Proposed later releases

### Release 2: Exploration campaign

- Exploration budget and target confidence.
- Multiple drillhole objectives.
- Inferred, indicated and measured resource confidence.
- A short decision summary after each exploration stage.

### Release 3: Mine design

- Pit shell and underground access objectives.
- Stripping-ratio target.
- Mining method comparison.
- Safety and geotechnical constraints.

### Release 4: Production

- Loader, truck, drill and plant capacities.
- Bottlenecks, queues and utilisation.
- Monthly production targets and operating costs.
- Stockpile blending.

### Release 5: Business game

- Commodity price scenarios.
- Funding milestones.
- Environmental and social decisions.
- Final project score and downloadable report.

## Deployment approach

1. Upload this build to `/public_html/sim-v2/`.
2. Test `https://dms-mining.com.na/sim-v2/popup-sim.html`.
3. Keep `/sim/` untouched during review.
4. Back up `/sim/` in cPanel.
5. Replace `/sim/` only after the staging build is accepted.
