document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        surveyButton: document.getElementById('survey-button'),
        resetButton: document.getElementById('reset-button'),
        drillReportButton: document.getElementById('drill-report-button'),
        buildButton: document.getElementById('build-button'),
        drillButton: document.getElementById('drill-button'),
        canvas: document.getElementById('block-canvas'),
        stockpileReportButton: document.getElementById('stockpile-report-button'),
        geoButton: document.getElementById('geo-button'),
        budgetElement: document.getElementById('budget'),
        mineOpenCutButton: document.getElementById('mine-open-cut-button'),
        mineUndergroundButton: document.getElementById('mine-underground-button'),
        totalResourceValueElement: document.getElementById('total-resource-value'),
        upgradeButton: document.getElementById('upgrade-button'),
        backButton: document.getElementById('back-button'),
        mainSection: document.getElementById('main-section'),
        upgradeSection: document.getElementById('upgrade-section'),
        welcomeScreen: document.getElementById('welcome-screen'),
        dialogueText: document.getElementById('dialogue-text'),
        dialogueButton: document.getElementById('dialogue-button'),
        introScreen: document.getElementById('intro-screen'),
        introButton: document.getElementById('intro-button'),
        getFundingButton: document.getElementById('get-funding-button'),
        reportContainer: document.getElementById('report-container'),
        seedElement: document.getElementById('seed-value'),
        seedInput: document.getElementById('seed-input'),
        seedButton: document.getElementById('set-seed-button'),
        surfaceExplorationButton: document.getElementById('surface-exploration-button'),
        estimateButton: document.getElementById('estimate-button'),
        showGraphsButton: document.getElementById('show-graphs-button'),
        hideGraphsButton: document.getElementById('hide-graphs-button'),
        graphsSection: document.getElementById('graphs-section'),
        stockpileCanvas: document.getElementById('stockpile-canvas'),
        hireMetallurgistButton: document.getElementById('hire-metallurgist-button'),
        hireSalesSpecialistButton: document.getElementById('hire-sales-specialist-button'),
        hireGeologistButton: document.getElementById('hire-geologist-button'),
        objectiveTitle: document.getElementById('objective-title'),
        objectiveDescription: document.getElementById('objective-description'),
        objectiveProgress: document.getElementById('objective-progress'),
        objectiveProgressBar: document.getElementById('objective-progress-bar'),
        objectiveList: document.getElementById('objective-list')
    };

    const ctx = elements.canvas.getContext('2d');
    const stockpileCtx = elements.stockpileCanvas.getContext('2d');

    const constants = {
        GEO_COST: 5000,
        BUILD_RESOURCE_COST: 100000,
        CREATE_BLOCK_MODEL_COST: 15000,
        LOAD_AND_HAUL_RATE: 1000,
        oreDensity: 2.77,
        COAL_DENSITY: 1.3,
        COAL_PRICE_PER_TON: 97.96,
        COPPER_DENSITY: 2.77,
        COAL_PROCESSING_COST_PER_TON: 30,
        WASTE_MINING_COST_UG: 100,
        WASTE_MINING_COST_OC: 2.5,
        ORE_MINING_COST_OC: 2.5,
        DRILLING_COST_PER_UNIT: 200,
        PROCESSING_COST_PER_TON: 50,
        ORE_MINING_COST_UG: 100,
        WASTE_DENSITY: 2.67,
        miningWidth: 1,
        INITIAL_MAX_DRILL_LENGTH: 200,
        UPGRADED_MAX_DRILL_LENGTH: 400,
        BLOCK_VOLUME: 1000,
        INITIAL_BUDGET: 10000000,
        BLOCK_SIZE_TONNES: 100000,
        BLOCK_SIZE: 10,
        rateIncreasePercentage: 0.20,
        UPGRADE_ENGINEER_COST: 250000,
        UPGRADE_GEOLOGIST_COST: 150000,
        UPGRADE_METALLURGIST_COST: 200000,
        UPGRADE_SALES_COST: 200000,
        UPGRADE_RIGS_COST: 300000
    };

    const objectives = [
        {
            id: 'geophysics',
            title: 'Conduct a geophysical study',
            description: 'Start with a broad scan to identify potential mineralised areas.',
            buttonId: 'geo-button'
        },
        {
            id: 'surface',
            title: 'Inspect the surface',
            description: 'Use surface exploration to confirm near-surface mineralisation.',
            buttonId: 'surface-exploration-button'
        },
        {
            id: 'drill',
            title: 'Complete the first drillhole',
            description: 'Select two points on the mining canvas to test the target at depth.',
            buttonId: 'drill-button'
        },
        {
            id: 'estimate',
            title: 'Estimate the resource',
            description: 'Interpolate the information gathered from exploration and drilling.',
            buttonId: 'estimate-button'
        },
        {
            id: 'block-model',
            title: 'Create a block model',
            description: 'Convert the geological interpretation into mineable blocks.',
            buttonId: 'survey-button'
        },
        {
            id: 'resource',
            title: 'Run a mini PFS',
            description: 'Evaluate only the resource supported by exploration and drilling data.',
            buttonId: 'build-button'
        },
        {
            id: 'mine-first-block',
            title: 'Mine the first block',
            description: 'Select a mining method, then remove an accessible block from the canvas.',
            buttonId: 'mine-open-cut-button'
        }
    ];

    let  state = {
        count: 0,
        isEngineerHired: false,
        isMetallurgistHired: false,
        isSalesSpecialistHired: false,
        isGeologistHired: false,
        estimateRadius: 40,
        recoveryRate: 0.90,
        currentMaxDrillLength: 200, // Initial max drill length
        COPPER_PRICE_PER_TON: 9000, // Default copper price
        miningRate: 1.0,
        containedOre: 0,
        totalCost: 0,
        totalRevenue: 0,
        surveyResults: [],
        drillingCostPerUnit: 1,
        totalDrillingCost: 0,
        totalDrillingRevenue: 0,
        totalWasteTons: 0,
        totalLowGradeTons: 0,
        totalMediumGradeTons: 0,
        totalHighGradeTons: 0,
        totalCopperContainedTons: 0,
        totalOreTonsMined: 0,
        totalWasteMiningCost: 0,
        totalOreMiningCost: 0,
        totalOreProcessingCost: 0,
        totalSurfaceWasteTons: 0,
        totalUndergroundWasteTons: 0,
        totalCoalTonsMined: 0,
        blockTons: 0,
        oreMiningCost: 0,
        wasteMiningCostUG: 0,
        totalDrilledLength: 0,
        totalIntersectedLength: 0,
        wasteMiningCostOC: 0,
        totalCopperExtracted: 0,
        isDMSPopupShown: false, 
        totalOreTons: 0,
        totalOreGrade: 0,
        explorationLocations: [],
        drillLocations: [],
        surfaceExplorationLocations: [],
        totalExplorationCost: 0,
        oreMiningRate: 0,
        wasteMiningRate: 0,
        intersectedGradeBlocks: 0,
        fundingPopupShown: false,
        oreRateInitialized: false,
        wasteRateInitialized: false,
        oreRateData: null,
        wasteRateData: null,
        oreRateMapping: null,
        wasteRateMapping: null,
        oreRateChart: null,
        wasteRateChart: null,
        oreRateMaxValue: 5000,
        wasteRateMaxValue: 5000,
        oreStockpile: [],
        wasteStockpile: [],
        mode: 'mine',
        drillStart: null,
        completedObjectives: {},
        dialogueIndex: 0,
        dialogues: [
            "Welcome to the DMS Mining Simulator",
            "We will try to teach you the basics of mining.",
            "Let's start with a Geophysical study to get an idea of what is around you."
        ],
        currentSeed: Math.floor(Math.random() * 100000),
        blockCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        blockSizeWidth: 1460,
        blockSizeHeight: 800,
        mineSize: 20,
        blockValues: [1, 2, 3, 4, 5],
        blockColors: ['#8B4513', '#D0BC8F', '#76737C', '#474454', '#000000'],
        blockData: [],
        originalBlockData: [],
        geoStudyResults: [],
        budget: constants.INITIAL_BUDGET,
        blockCoalGrades: [],
        textureImage: new Image()
    };

    state.textureImage.src = 'ground.png';
    state.textureImage.onload = initializeBlock;

    const blockSizeWidth = 1460; // Adjust this to your actual canvas width
    const blockSizeHeight = 800; // Adjust this to your actual canvas height

    if (typeof Math.seedrandom === 'undefined') {
        console.error('seedrandom is not defined');
        return;
    } else {
        console.log('seedrandom is defined');
    }

    Math.seedrandom(state.currentSeed);
    displaySeed();
    updateBudgetDisplay();
    renderObjectives();

    elements.seedButton.addEventListener('click', () => {
        const newSeed = parseInt(elements.seedInput.value, 10);
        if (!isNaN(newSeed)) {
            state.currentSeed = newSeed;
            Math.seedrandom(state.currentSeed);
            resetSimulation();
        }
    });

    const hireEngineerButton = document.getElementById('hire-engineer-button');
    const upgradeExplorationRigsButton = document.getElementById('upgrade-exploration-rigs-button');

    let oreRateData;
    let wasteRateData;
    let oreRateMaxValue = 5000; // Initialize with a sensible default
    let wasteRateMaxValue = 5000; // Initialize with a sensible default

    if (typeof anychart !== 'undefined') {
        initializeCharts();
    } else {
        console.warn('AnyChart did not load. Production graphs are unavailable.');
        elements.showGraphsButton.disabled = true;
    }

    hireEngineerButton.addEventListener('click', hireEngineer);
    upgradeExplorationRigsButton.addEventListener('click', upgradeExplorationRigs);
    elements.hireMetallurgistButton.addEventListener('click', hireMetallurgist);
    elements.hireSalesSpecialistButton.addEventListener('click', hireSalesSpecialist); // New event listener
    elements.hireGeologistButton.addEventListener('click', hireGeologist); // New event listener

    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    function updateBudgetDisplay() {
        elements.budgetElement.textContent = formatNumberWithSpaces(state.budget.toFixed(2));
    }

    function selectModeButton(selectedButton) {
        [elements.drillButton, elements.mineOpenCutButton, elements.mineUndergroundButton]
            .forEach(button => button.classList.remove('selected'));
        selectedButton.classList.add('selected');
    }

    function spendBudget(cost, description) {
        if (state.budget < cost) {
            alert(`Insufficient budget for ${description}.`);
            return false;
        }
        state.budget -= cost;
        state.totalCost += cost;
        updateBudgetDisplay();
        return true;
    }

    function markUpgradePurchased(button) {
        button.classList.add('is-purchased');
        button.disabled = true;
        const price = button.querySelector('span');
        if (price) {
            price.textContent = 'Purchased';
        }
    }

    function completeObjective(objectiveId) {
        if (!state.completedObjectives[objectiveId]) {
            state.completedObjectives[objectiveId] = true;
            renderObjectives();
        }
    }

    function renderObjectives() {
        const completedCount = objectives.filter(objective => state.completedObjectives[objective.id]).length;
        const currentObjective = objectives.find(objective => !state.completedObjectives[objective.id]);

        elements.objectiveProgress.textContent = `${completedCount} / ${objectives.length}`;
        elements.objectiveProgressBar.style.width = `${(completedCount / objectives.length) * 100}%`;
        elements.objectiveList.innerHTML = objectives.map(objective => `
            <li class="${state.completedObjectives[objective.id] ? 'is-complete' : ''}">
                ${objective.title}
            </li>
        `).join('');

        document.querySelectorAll('.action-card').forEach(button => button.classList.remove('objective-focus'));

        if (currentObjective) {
            elements.objectiveTitle.textContent = currentObjective.title;
            elements.objectiveDescription.textContent = currentObjective.description;
            const currentButton = document.getElementById(currentObjective.buttonId);
            if (currentButton) {
                currentButton.classList.add('objective-focus');
            }
        } else {
            elements.objectiveTitle.textContent = 'Project foundation complete';
            elements.objectiveDescription.textContent =
                'You have completed the introductory mining value chain. Continue mining or start a new project seed.';
        }
    }


    function calculateBlockMass() {
        return constants.BLOCK_VOLUME * constants.oreDensity;
    }
    elements.getFundingButton.disabled = true;

    elements.surfaceExplorationButton.addEventListener('click', conductSurfaceExploration);

    elements.estimateButton.addEventListener('click', estimateResource);
    elements.showGraphsButton.addEventListener('click', () => {
        elements.graphsSection.style.display = 'block';
        drawCharts();
    });
    elements.hideGraphsButton.addEventListener('click', () => {
        elements.graphsSection.style.display = 'none';
    });

    elements.introButton.addEventListener('click', handleIntroScreen);
    elements.dialogueButton.addEventListener('click', showNextDialogue);

    elements.surveyButton.addEventListener('click', createBlockModel);
    elements.drillButton.addEventListener('click', () => {
        console.log("Drill button clicked.");
        selectModeButton(elements.drillButton);
        simulateDrillholes();
    });

    elements.resetButton.addEventListener('click', resetSimulation);
    elements.buildButton.addEventListener('click', showFullResource);
    elements.geoButton.addEventListener('click', conductGeophysicalStudy);
    elements.mineOpenCutButton.addEventListener('click', () => {
        console.log("Mine Open Cut mode enabled.");
        selectModeButton(elements.mineOpenCutButton);
        state.mode = 'mineOpenCut';
    });

    elements.mineUndergroundButton.addEventListener('click', () => {
        console.log("Mine Underground mode enabled.");
        selectModeButton(elements.mineUndergroundButton);
        state.mode = 'mineUnderground';
    });

    elements.drillReportButton.addEventListener('click', toggleReportVisibility);
    elements.stockpileReportButton.addEventListener('click', toggleStockpileReport);

    elements.upgradeButton.addEventListener('click', () => {
        elements.mainSection.style.display = 'none';
        elements.upgradeSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    elements.backButton.addEventListener('click', () => {
        elements.upgradeSection.style.display = 'none';
        elements.mainSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    elements.canvas.addEventListener('click', handleCanvasClick);

    elements.getFundingButton.addEventListener('click', () => {
        if (state.intersectedGradeBlocks >= 10) {
            state.budget += 1000000;
            updateBudgetDisplay();
            elements.getFundingButton.disabled = true;
            showFundingPopup(true);
        } else {
            alert('You are not eligible for more funding.');
        }
    });

    const aboutButton = document.getElementById('about-button');
    aboutButton.addEventListener('click', showAboutPopup);
    function showAboutPopup() {
        const aboutPopup = document.createElement('div');
        aboutPopup.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; color: #17111f; padding: 24px; border: 1px solid black; border-radius: 12px; z-index: 1000; max-width: 800px;">
            <h2>Contact Us</h2>
            <p>Tel: +264 81 776 2578</p>
			<p><a href="https://www.dms-mining.com.na">Visit Website</a></p>
			<p><a href="mailto:pehlers@dms-mining.com.na">Email DMS Mining</a></p>
            <p>We look forward to hearing from you!</p>
            <button id="close-about-button" style="background-color: #6f2c91; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px;">Close</button>
        </div>
    `;
        document.body.appendChild(aboutPopup);

        const closeAboutButton = aboutPopup.querySelector('#close-about-button');
        closeAboutButton.addEventListener('click', () => {
            document.body.removeChild(aboutPopup);
        });
    }


    const revenueValues = {
        1: { value: 0, grade: 0 },
        2: { value: 65, grade: 2 },
        3: { value: 70, grade: 3 },
        4: { value: 100, grade: 4 },
        5: { value: 50, grade: 0 }
    };

    function calculateLoadAndHaulTime(blockTons) {
        return blockTons / constants.LOAD_AND_HAUL_RATE;
    }

    function calculateRevenue(blockMass, grade, recoveryFactor) {
        const containedOre = blockMass * (grade / 100);
        const recoveredOre = containedOre * recoveryFactor;
        const revenue = recoveredOre * state.COPPER_PRICE_PER_TON;
        if (isNaN(revenue)) {
            console.error(`Revenue is NaN. Block Mass: ${blockMass}, Grade: ${grade}, Recovery Factor: ${recoveryFactor}, Copper Price per Ton: ${state.COPPER_PRICE_PER_TON}`);
        }
        return revenue;
    }

    function calculateOreProcessingCost(blockMass) {
        const cost = blockMass * constants.PROCESSING_COST_PER_TON;
        if (isNaN(cost)) {
            console.error(`Ore Processing Cost is NaN. Block Mass: ${blockMass}, Processing Cost per Ton: ${constants.PROCESSING_COST_PER_TON}`);
        }
        return cost;
    }
    let oreRateChart;
    let wasteRateChart;

    function initializeCharts() {
        anychart.onDocumentReady(function () {
            // Create data sets
            oreRateData = anychart.data.set([]);
            wasteRateData = anychart.data.set([]);

            // Map data for the line series
            let oreRateMapping = oreRateData.mapAs({ x: 0, value: 1 });
            let wasteRateMapping = wasteRateData.mapAs({ x: 0, value: 1 });

            // Create line charts
            oreRateChart = anychart.line();
            wasteRateChart = anychart.line();

            // Set titles
            oreRateChart.title('Ore Mining Rate (tons/day)');
            wasteRateChart.title('Waste Mining Rate (tons/day)');

            // Set the series
            oreRateChart.line(oreRateMapping).name('Ore Mining Rate').stroke('Green');
            wasteRateChart.line(wasteRateMapping).name('Waste Mining Rate');

            // Set container id for the charts
            oreRateChart.container('ore-rate-graph');
            wasteRateChart.container('waste-rate-graph');

            // Set y-axis min/max
            oreRateChart.yScale().minimum(0).maximum(oreRateMaxValue);
            wasteRateChart.yScale().minimum(0).maximum(wasteRateMaxValue);

            // Draw the charts
            oreRateChart.draw();
            wasteRateChart.draw();

            // Configure X-axis to display time-based labels after the charts are drawn
            configureXAxis(oreRateChart);
            configureXAxis(wasteRateChart);
        });
    }

    function configureXAxis(chart) {
        chart.xScale(anychart.scales.dateTime());
        chart.xAxis().title('Time');
        chart.xAxis().labels().format(() => {
            return anychart.format.dateTime(this.value, 'yyyy-MM-dd');
        });
    }


    // Function to hide grade information
    elements.canvas.addEventListener('mouseleave', function () {
        const gradeInfo = document.getElementById('grade-info');
        gradeInfo.style.display = 'none';
    });


    function displaySeed() {
        elements.seedElement.textContent = state.currentSeed;
    }

    function initializeBlock() {
        console.log("Initializing block...");
        ctx.clearRect(0, 0, state.blockSizeWidth, state.blockSizeHeight);
        state.blockData = [];
        for (let key in state.blockCounts) {
            state.blockCounts[key] = 0;
        }
        state.totalRevenue = 0;
        state.totalDrilledLength = 0;
        state.totalIntersectedLength = 0;
        state.totalDrillingCost = 0;
        state.totalDrillingRevenue = 0;
        state.budget = constants.INITIAL_BUDGET;
        state.originalBlockData = generateOriginalBlockData();
        state.blockCoalGrades = generateBlockCoalGrades();
        const texturePattern = ctx.createPattern(state.textureImage, 'repeat');
        for (let y = 0; y < state.blockSizeHeight; y += state.mineSize) {
            const row = [];
            for (let x = 0; x < state.blockSizeWidth; x += state.mineSize) {
                ctx.fillStyle = texturePattern;
                ctx.fillRect(x, y, state.mineSize, state.mineSize);
                row.push(1);
            }
            state.blockData.push(row);
        }
        state.count = 0;
        state.totalCost = 0;
        state.surveyResults = [];
        state.geoStudyResults = [];
        console.log("Block initialized.");
    }

    function generateOriginalBlockData() {
        state.originalBlockData = Array.from({ length: state.blockSizeHeight / state.mineSize }, () => Array(state.blockSizeWidth / state.mineSize).fill(1));
        const randomValue = Math.random();
        if (randomValue < 0.01) {
            createCoalSeams();
        } else if (randomValue < 0.02) {
            generateKimberlitePipe();
        } else {
            generateRandomWalkClusters();
        }
        console.log("Original block data generated:", state.originalBlockData);
        return state.originalBlockData;
    }

    function createCoalSeams() {
        const width = state.blockSizeWidth / state.mineSize;
        const height = state.blockSizeHeight / state.mineSize;
        const coalSeamsCount = Math.random() < 0.5 ? 1 : 2;
        for (let seam = 0; seam < coalSeamsCount; seam++) {
            const coalY = Math.floor(Math.random() * (height / coalSeamsCount) + (seam * height / coalSeamsCount));
            const coalWidth = Math.floor(Math.random() * (width / 2)) + 5;
            const coalX = Math.floor(Math.random() * (width - coalWidth));
            for (let x = coalX; x < coalX + coalWidth && x < width; x++) {
                if (coalY >= 0 && coalY < height) {
                    state.originalBlockData[coalY][x] = 5;
                    let dip = Math.floor(Math.random() * 3 - 1);
                    if (coalY + dip >= 0 && coalY + dip < height) {
                        state.originalBlockData[coalY + dip][x] = 5;
                    }
                }
            }
        }
    }

    function generateKimberlitePipe() {
        const width = state.blockSizeWidth / state.mineSize;
        const height = state.blockSizeHeight / state.mineSize;
        const centerX = Math.floor(Math.random() * width);
        const maxRadius = Math.floor(Math.random() * (width / 8)) + (width / 16);
        const minRadius = Math.floor(Math.random() * 2) + 1;
        const diamondConcentration = 4;
        for (let y = 0; y < height; y++) {
            const normalizedHeight = y / height;
            const currentRadius = maxRadius * (1 - normalizedHeight) + minRadius * normalizedHeight;
            for (let x = 0; x < width; x++) {
                if (Math.abs(x - centerX) <= currentRadius) {
                    const distanceFromCenter = Math.abs(x - centerX);
                    const diamondValue = diamondConcentration * (1 - distanceFromCenter / currentRadius);
                    state.originalBlockData[y][x] = Math.max(1, Math.ceil(diamondValue));
                } else {
                    if (Math.abs(x - centerX) <= currentRadius + 1) {
                        state.originalBlockData[y][x] = 2;
                    }
                }
            }
        }
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (state.originalBlockData[y][x] > 1 && Math.random() < 0.1) {
                    state.originalBlockData[y][x] = Math.max(1, state.originalBlockData[y][x] - 1);
                }
            }
        }
    }

    function generateRandomWalkClusters() {
        const width = blockSizeWidth / state.mineSize;
        const height = blockSizeHeight / state.mineSize;
        const grid = Array.from({ length: height }, () => Array(width).fill(1)); // Start with all waste blocks

        // Define geological units with specific colors
        const geologicalUnits = [
            { name: 'Dolomite', startY: 0, endY: height / 3, color: '#FFD700', oreGrade: 2 }, // Yellow, low-grade ore
            { name: 'Phyllite', startY: height / 3, endY: 2 * height / 3, color: '#6A5ACD', oreGrade: 3 }, // SlateBlue, medium-grade ore
            { name: 'Granite', startY: 2 * height / 3, endY: height, color: '#D3D3D3', oreGrade: 4 } // LightGray, high-grade ore
        ];

        const clusterCount = 5; // Number of large clusters
        const minClusterSize = 400; // Minimum size for large clusters
        const maxClusterSize = 800; // Maximum size for large clusters
        const scatteredBlockChance = 0.001; // Chance to convert a block to ore on the surface
        const highGradeBlockChance = 0.001; // Chance to create a high-grade isolated block
        const highGradeColor = '#FF0000'; // Red color for high-grade blocks

        function randomWalkCluster(x, y, steps, value, color) {
            let clusterSize = 0;
            for (let i = 0; i < steps; i++) {
                if (grid[y][x] === 1) {
                    grid[y][x] = value;
                    ctx.fillStyle = color;
                    ctx.fillRect(x * state.mineSize, y * state.mineSize, state.mineSize, state.mineSize);
                    clusterSize++;
                }
                const direction = Math.floor(Math.random() * 5);
                switch (direction) {
                    case 0: if (y > 0) y--; break;
                    case 1: if (y < height - 1) y++; break;
                    case 2: if (x > 0) x--; break;
                    case 3: if (x < width - 1) x++; break;
                }
            }
        }

        function getGeologicalUnit(y) {
            for (const unit of geologicalUnits) {
                if (y >= unit.startY && y < unit.endY) {
                    return unit;
                }
            }
            return geologicalUnits[0];
        }

        for (let i = 0; i < clusterCount; i++) {
            const startX = Math.floor(Math.random() * width);
            const startY = Math.floor(Math.random() * height);
            const steps = Math.floor(Math.random() * (maxClusterSize - minClusterSize + 1)) + minClusterSize;
            const unit = getGeologicalUnit(startY);
            randomWalkCluster(startX, startY, steps, unit.oreGrade, unit.color);
        }

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (grid[y][x] === 1) {
                    if (Math.random() < highGradeBlockChance) {
                        grid[y][x] = 4;
                        ctx.fillStyle = highGradeColor;
                        ctx.fillRect(x * state.mineSize, y * state.mineSize, state.mineSize, state.mineSize);
                    } else if (Math.random() < scatteredBlockChance) {
                        const unit = getGeologicalUnit(y);
                        grid[y][x] = unit.oreGrade;
                        ctx.fillStyle = unit.color;
                        ctx.fillRect(x * state.mineSize, y * state.mineSize, state.mineSize, state.mineSize);
                    }
                }
            }
        }

        // Add faults and draw them as black lines
        addRandomFaults(grid, width, height);

        // Convert to originalBlockData format
        grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                state.originalBlockData[y][x] = cell;
            });
        });
    }

    function addRandomFaults(grid, width, height) {
        const faultCount = 5; // Number of faults to create

        for (let i = 0; i < faultCount; i++) {
            const startX = Math.floor(Math.random() * width);
            const startY = Math.floor(Math.random() * height);
            const length = Math.floor(Math.random() * (Math.min(width, height) / 2)) + 10; // Random length
            const direction = Math.floor(Math.random() * 7); // Random direction: 0=up, 1=down, 2=left, 3=right

            let x = startX;
            let y = startY;

            ctx.strokeStyle = 'green';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x * state.mineSize, y * state.mineSize);

            for (let j = 0; j < length; j++) {
                if (x >= 0 && x < width && y >= 0 && y < height) {
                    grid[y][x] = 1; // Convert blocks along the fault to waste
                    ctx.lineTo(x * state.mineSize, y * state.mineSize);

                    switch (direction) {
                        case 0: if (y > 0) y--; break; // Up
                        case 1: if (y < height - 1) y++; break; // Down
                        case 2: if (x > 0) x--; break; // Left
                        case 3: if (x < width - 1) x++; break; // Right
                        case 4: if (x < width - 1 && y > 0) { x++; y--; } break; // Up-Right
                        case 5: if (x > 0 && y > 0) { x--; y--; } break; // Up-Left
                        case 6: if (x < width - 1 && y < height - 1) { x++; y++; } break; // Down-Right
                        case 7: if (x > 0 && y < height - 1) { x--; y++; } break; // Down-Left
                    }
                } else {
                    break;
                }
            }

            ctx.stroke();
        }
    }
    function conductSurfaceExploration() {
        console.log("Conducting surface exploration...");
        state.geoStudyResults = [];
        for (let y = 0; y < state.mineSize * 3; y += state.mineSize) {
            for (let x = 0; x < state.blockSizeWidth; x += state.mineSize) {
                const value = state.originalBlockData[y / state.mineSize][x / state.mineSize];
                if (value > 1) {
                    console.log(`Ore block found at (${x * state.mineSize}, ${y * state.mineSize}) with value ${value}`);
                    const hintX = Math.floor(x / state.mineSize) * state.mineSize;
                    const hintY = Math.floor(y / state.mineSize) * state.mineSize;
                    if (hintX >= 0 && hintX < state.blockSizeWidth && hintY >= 0 && hintY < state.blockSizeHeight) {
                        state.geoStudyResults.push({ x: hintX, y: hintY });
                        state.surfaceExplorationLocations.push({ x: hintX, y: hintY });
                        console.log(`Hint at (${hintX}, ${hintY}) for ore block at (${x * state.mineSize}, ${y * state.mineSize})`);
                        ctx.fillStyle = state.blockColors[value - 1];
                        ctx.fillRect(hintX, hintY, state.mineSize, state.mineSize);
                        ctx.strokeStyle = 'black';
                        ctx.strokeRect(hintX, hintY, state.mineSize, state.mineSize);
                        const grade = value === 2 ? 2 : value === 3 ? 3 : 4;
                        ctx.fillStyle = 'black';
                        ctx.fillText(`${grade}%`, hintX + state.mineSize / 2 - 5, hintY + state.mineSize / 2 + 5);
                    }
                }
            }
        }
        console.log("Surface exploration results:", state.geoStudyResults);
        const surfaceExplorationCost = constants.GEO_COST * 0.5;
        state.budget -= surfaceExplorationCost;
        state.totalExplorationCost += surfaceExplorationCost;
        state.totalCost += surfaceExplorationCost;
        updateBudgetDisplay();
        generateReport();
        completeObjective('surface');
        console.log("Surface exploration completed.");
    }


    function updateOreRateGraph() {
        if (!oreRateData || !oreRateChart) {
            return;
        }
        const currentTime = new Date().getTime(); // Ensure timestamp is in milliseconds
        const newOreRate = state.oreMiningRate; // Ensure oreMiningRate is defined and calculated correctly
        oreRateData.append([currentTime, newOreRate]);

        // Update the maximum value for the Y-axis if needed
        if (newOreRate > oreRateMaxValue) {
            oreRateMaxValue = newOreRate;
            oreRateChart.yScale().maximum(oreRateMaxValue);
        }

        // Redraw the chart
        oreRateChart.draw();
    }
    function updateWasteRateGraph() {
        if (!wasteRateData || !wasteRateChart) {
            return;
        }
        const currentTime = new Date().getTime(); // Ensure timestamp is in milliseconds
        const newWasteRate = state.wasteMiningRate; // Ensure wasteMiningRate is defined and calculated correctly
        wasteRateData.append([currentTime, newWasteRate]);

        // Update the maximum value for the Y-axis if needed
        if (newWasteRate > wasteRateMaxValue) {
            wasteRateMaxValue = newWasteRate;
            wasteRateChart.yScale().maximum(wasteRateMaxValue);
        }

        // Redraw the chart
        wasteRateChart.draw();
    }

    function drawCharts() {
        if (oreRateChart) {
            oreRateChart.draw();
        }
        if (wasteRateChart) {
            wasteRateChart.draw();
        }
    }

    function formatNumberWithSpaces(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    function handleIntroScreen() {
        elements.introScreen.style.display = 'none';
        elements.welcomeScreen.style.display = 'flex';
        showNextDialogue();
    }

    function showNextDialogue() {
        if (state.dialogueIndex < state.dialogues.length) {
            elements.dialogueText.textContent = state.dialogues[state.dialogueIndex];
            state.dialogueIndex++;
        } else {
            elements.welcomeScreen.style.display = 'none';
        }
    }

    function createBlockModel() {
        console.log("Conducting geological survey...");
        state.surveyResults = [];
        state.budget -= constants.CREATE_BLOCK_MODEL_COST;
        state.totalExplorationCost += constants.CREATE_BLOCK_MODEL_COST;
        state.totalCost += constants.CREATE_BLOCK_MODEL_COST;
        updateBudgetDisplay();
        for (let y = 0; y < state.blockSizeHeight; y += state.mineSize) {
            for (let x = 0; x < state.blockSizeWidth; x += state.mineSize) {
                const value = state.originalBlockData[y / state.mineSize][x / state.mineSize];
                if (value > 1) {
                    console.log(`Ore block found at (${x * state.mineSize}, ${y * state.mineSize}) with value ${value}`);
                    const hintX = Math.floor(x / state.mineSize) * state.mineSize;
                    const hintY = 0;
                    if (hintX >= 0 && hintX < state.blockSizeWidth) {
                        state.surveyResults.push({ x: hintX, y: hintY });
                        console.log(`Hint at (${hintX}, ${hintY}) for ore block at (${x * state.mineSize}, ${y * state.mineSize})`);
                    }
                }
            }
        }
        console.log("Geological survey results:", state.surveyResults);
        state.surveyResults.forEach(result => {
            ctx.strokeStyle = 'blue';
            ctx.beginPath();
            ctx.arc(result.x + state.mineSize / 2, result.y + state.mineSize / 2, state.mineSize / 2, 0, 2 * Math.PI);
            ctx.stroke();
            console.log(`Drawing circle at (${result.x}, ${result.y})`);
        });
        completeObjective('block-model');
        console.log("Geological survey completed.");
    }

    function showFullResource() {
        showDMSPopup();
    }

    function showDMSPopup() {
        const dmsPopup = document.createElement('div');
        dmsPopup.className = 'modal-overlay';
        dmsPopup.innerHTML = `
			<div class="modal-card modal-card--resource" role="dialog" aria-modal="true" aria-labelledby="resource-modal-title">
                <img class="modal-logo" src="icon.png" alt="DMS Mining">
                <p class="eyebrow">Pre-feasibility screening</p>
                <h2 id="resource-modal-title">Run a mini PFS</h2>
                <p>
                    Evaluate only the blocks supported by surface exploration and drill
                    intersections. Untested areas will remain unknown and hidden.
                </p>
                <div class="modal-actions">
                    <a class="button button--ghost" href="https://www.dms-mining.com.na" target="_blank" rel="noopener">Visit DMS Mining</a>
                    <button id="continue-button" class="button button--primary" type="button">Run study</button>
                </div>
            </div>
        `;
        document.body.appendChild(dmsPopup);
        const continueButton = dmsPopup.querySelector('#continue-button');
        continueButton.addEventListener('click', () => {
            document.body.removeChild(dmsPopup);
            finalizeBuildResource();
        });
    }

    function finalizeBuildResource() {
        console.log("Running mini PFS...");
        if (state.totalDrilledLength <= 0) {
            alert('Complete at least one drillhole before running the mini PFS.');
            return;
        }
        if (!state.completedObjectives['block-model']) {
            alert('Estimate the resource and create the block model before running the mini PFS.');
            return;
        }
        if (!spendBudget(constants.BUILD_RESOURCE_COST, 'the mini PFS')) {
            return;
        }

        const confidenceTons = {
            measured: 0,
            indicated: 0,
            inferred: 0
        };
        let oreTons = 0;
        let wasteTons = 0;
        let weightedGrade = 0;
        let weightedCoalGrade = 0;
        let coalTons = 0;
        let copperTons = 0;
        let supportedBlocks = 0;

        function nearestDistance(x, y, locations) {
            if (!locations.length) {
                return Infinity;
            }
            return locations.reduce((nearest, location) => {
                const distance = Math.hypot(location.x - x, location.y - y);
                return Math.min(nearest, distance);
            }, Infinity);
        }

        for (let y = 0; y < state.blockSizeHeight; y += state.mineSize) {
            for (let x = 0; x < state.blockSizeWidth; x += state.mineSize) {
                const drillDistance = nearestDistance(x, y, state.drillLocations);
                const surfaceDistance = nearestDistance(x, y, state.surfaceExplorationLocations);
                let confidence = null;

                if (drillDistance <= state.mineSize) {
                    confidence = 'measured';
                } else if (drillDistance <= state.estimateRadius) {
                    confidence = 'indicated';
                } else if (
                    drillDistance <= state.estimateRadius * 1.5 ||
                    surfaceDistance <= state.estimateRadius
                ) {
                    confidence = 'inferred';
                }

                if (!confidence) {
                    continue;
                }

                supportedBlocks++;
                const blockY = y / state.mineSize;
                const blockX = x / state.mineSize;
                const value = state.originalBlockData[blockY][blockX];

                if (value === 2 || value === 3 || value === 4) {
                    const grade = value === 2 ? 2 : value === 3 ? 3 : 4;
                    const blockTons = state.mineSize * state.mineSize * 10 * constants.COPPER_DENSITY;
                    oreTons += blockTons;
                    copperTons += blockTons;
                    weightedGrade += grade * blockTons;
                    confidenceTons[confidence] += blockTons;
                } else if (value === 5) {
                    const blockTons = state.mineSize * state.mineSize * 10 * constants.COAL_DENSITY;
                    oreTons += blockTons;
                    coalTons += blockTons;
                    weightedCoalGrade += state.blockCoalGrades[blockY][blockX] * blockTons;
                    confidenceTons[confidence] += blockTons;
                } else if (value === 1) {
                    const blockTons = state.mineSize * state.mineSize * 10 * constants.WASTE_DENSITY;
                    wasteTons += blockTons;
                }
            }
        }

        const recovery = Math.min(0.98, state.recoveryRate);
        const averageGrade = copperTons > 0 ? weightedGrade / copperTons : 0;
        const averageCoalGrade = coalTons > 0 ? weightedCoalGrade / coalTons : 0;
        const containedCopper = copperTons * (averageGrade / 100);
        const recoveredCopper = containedCopper * recovery;
        const copperValue = recoveredCopper * state.COPPER_PRICE_PER_TON;
        const coalValue = coalTons * constants.COAL_PRICE_PER_TON;
        const grossValue = copperValue + coalValue;
        const miningCost =
            oreTons * constants.ORE_MINING_COST_OC +
            wasteTons * constants.WASTE_MINING_COST_OC;
        const processingCost =
            copperTons * constants.PROCESSING_COST_PER_TON +
            coalTons * constants.COAL_PROCESSING_COST_PER_TON;
        const indicativeMargin =
            grossValue - miningCost - processingCost - constants.BUILD_RESOURCE_COST;
        const strippingRatio = oreTons > 0 ? wasteTons / oreTons : 0;

        elements.totalResourceValueElement.textContent = `$${formatNumber(grossValue.toFixed(0))}`;
        document.getElementById('average-grade').textContent =
            copperTons > 0
                ? `Average grade: ${averageGrade.toFixed(2)}% Cu`
                : coalTons > 0
                    ? `Average GCV: ${averageCoalGrade.toFixed(0)} kcal/kg`
                    : 'Average grade: no supported resource';
        document.getElementById('average-recovery').textContent =
            `Assumed recovery: ${(recovery * 100).toFixed(0)}%`;

        const result = {
            supportedBlocks,
            oreTons,
            wasteTons,
            confidenceTons,
            averageGrade,
            averageCoalGrade,
            recoveredCopper,
            grossValue,
            miningCost,
            processingCost,
            indicativeMargin,
            strippingRatio
        };

        if (oreTons > 0) {
            showPfsResults(result);
        } else {
            showPfsResults(result, true);
        }

        completeObjective('resource');
        console.log("Mini PFS completed.");
    }

    function showPfsResults(result, noResource = false) {
        const pfsPopup = document.createElement('div');
        pfsPopup.className = 'modal-overlay';
        const marginClass = result.indicativeMargin >= 0 ? 'pfs-positive' : 'pfs-negative';
        const resourceLabel = result.averageCoalGrade > 0 ? 'Coal resource' : 'Copper resource';
        const gradeLabel = result.averageCoalGrade > 0
            ? `${result.averageCoalGrade.toFixed(0)} kcal/kg average GCV`
            : `${result.averageGrade.toFixed(2)}% Cu average grade`;

        pfsPopup.innerHTML = `
            <div class="modal-card modal-card--pfs" role="dialog" aria-modal="true" aria-labelledby="pfs-title">
                <p class="eyebrow">Mini PFS result</p>
                <h2 id="pfs-title">${noResource ? 'No supported resource defined' : 'Indicative project case'}</h2>
                <p class="pfs-note">
                    Based only on drill intersections and surface-supported blocks.
                    Untested areas remain excluded.
                </p>
                <div class="pfs-grid">
                    <div><span>Data-supported blocks</span><strong>${formatNumber(result.supportedBlocks)}</strong></div>
                    <div><span>${resourceLabel}</span><strong>${formatNumber(result.oreTons.toFixed(0))} t</strong></div>
                    <div><span>Quality</span><strong>${gradeLabel}</strong></div>
                    <div><span>Stripping ratio</span><strong>${result.strippingRatio.toFixed(2)} : 1</strong></div>
                    <div><span>Gross recovered value</span><strong>$${formatNumber(result.grossValue.toFixed(0))}</strong></div>
                    <div><span>Mining cost</span><strong>$${formatNumber(result.miningCost.toFixed(0))}</strong></div>
                    <div><span>Processing cost</span><strong>$${formatNumber(result.processingCost.toFixed(0))}</strong></div>
                    <div class="${marginClass}"><span>Indicative margin</span><strong>$${formatNumber(result.indicativeMargin.toFixed(0))}</strong></div>
                </div>
                <div class="pfs-confidence">
                    <span>Measured: ${formatNumber(result.confidenceTons.measured.toFixed(0))} t</span>
                    <span>Indicated: ${formatNumber(result.confidenceTons.indicated.toFixed(0))} t</span>
                    <span>Inferred: ${formatNumber(result.confidenceTons.inferred.toFixed(0))} t</span>
                </div>
                <p class="pfs-disclaimer">
                    Educational screening result only. It is not a code-compliant mineral
                    resource estimate or professional pre-feasibility study.
                </p>
                <button class="button button--primary" id="close-pfs-button" type="button">Return to project</button>
            </div>
        `;
        document.body.appendChild(pfsPopup);
        pfsPopup.querySelector('#close-pfs-button').addEventListener('click', () => {
            document.body.removeChild(pfsPopup);
        });
    }

    function mineBlock(x, y) {
        if (state.mode === 'mineOpenCut' && !canMineOpenCut(x, y)) {
            alert('This block cannot be mined yet.');
            return;
        }

        if (state.mode === 'mineUnderground' && !canMineUnderground(x, y)) {
            alert('This block cannot be mined yet.');
            return;
        }

        const blockIndexX = Math.floor(x / state.mineSize);
        const blockIndexY = Math.floor(y / state.mineSize);

        console.log(`Mining block at (${x}, ${y}), index (${blockIndexX}, ${blockIndexY})`);

        // Ensure the mining width doesn't exceed canvas boundaries
        const startX = blockIndexX;
        const endX = blockIndexX;

        for (let i = startX; i <= endX; i++) {
            if (!state.blockData[blockIndexY] || state.blockData[blockIndexY][i] === 0) {
                continue;
            }
            const img = new Image();
            img.src = 'ground.png'; // Replace with the path to your PNG image
            
            drawBlock(i * state.mineSize, blockIndexY * state.mineSize, 'green');
            setTimeout(() => {
                drawBlock(i * state.mineSize, blockIndexY * state.mineSize, 'orange');
                setTimeout(() => {
                    const blockMass = calculateBlockMass();
                    const loadAndHaulTime = calculateLoadAndHaulTime(blockMass) * 1000;

                    drawBlock(i * state.mineSize, blockIndexY * state.mineSize,'red');
                    setTimeout(() => {
                        ctx.clearRect(i * state.mineSize, blockIndexY * state.mineSize, state.mineSize, state.mineSize);
                        ctx.fillStyle = 'black';
                        ctx.fillRect(i * state.mineSize, blockIndexY * state.mineSize, state.mineSize, state.mineSize);
                        state.blockData[blockIndexY][i] = 0;

                        const value = state.originalBlockData[blockIndexY][i];
                        if (value > 0) {
                            state.blockCounts[value] += 1;

                            const method = (state.mode === 'mineOpenCut') ? 'OC' : 'UG';
                            const miningCost = calculateMiningCost(value === 1 ? 'waste' : 'ore', method);
                            const baseRecovery = (blockIndexY < 2) ? 0.65 : 0.90;
                            const recoveryFactor = Math.min(0.98, baseRecovery + (state.isMetallurgistHired ? 0.01 : 0));

                            console.log(`Value: ${value}, Mining Cost: ${miningCost}, Recovery Factor: ${recoveryFactor}`);

                            let blockTons = calculateBlockMass();
                            let revenue = 0;
                            if (value === 5) {
                                state.totalCoalTonsMined += blockTons;
                                revenue = blockTons * constants.COAL_PRICE_PER_TON;
                                state.totalRevenue += revenue;
                            } else if (value > 1) {
                                const grade = revenueValues[value].grade;
                                revenue = calculateRevenue(blockTons, grade, recoveryFactor);
                                state.totalRevenue += revenue;
                                state.totalOreTonsMined += blockTons;
                                state.totalOreProcessingCost += calculateOreProcessingCost(blockTons);
                                state.totalCopperExtracted += blockTons * (grade / 100) * recoveryFactor;
                                state.totalOreMiningCost += miningCost;

                                addToStockpile('ore', blockTons, grade);
                                const loadAndHaulCost = calculateLoadAndHaulCost('ore', blockTons);
                                state.budget -= loadAndHaulCost;
                                state.totalCost += miningCost + calculateOreProcessingCost(blockTons) + loadAndHaulCost;
                                state.oreMiningRate = blockTons * (state.isEngineerHired ? (1 + constants.rateIncreasePercentage) : 1);
                            } else {
                                state.totalWasteTons += blockTons;

                                if (state.mode === 'mineOpenCut') {
                                    state.wasteMiningCostOC += miningCost;
                                } else {
                                    state.wasteMiningCostUG += miningCost;
                                }

                                addToStockpile('waste', blockTons);
                                const loadAndHaulCost = calculateLoadAndHaulCost('waste', blockTons);
                                state.budget -= loadAndHaulCost;
                                state.totalCost += miningCost + loadAndHaulCost;
                                state.wasteMiningRate = blockTons * (state.isEngineerHired ? (1 + constants.rateIncreasePercentage) : 1);
                            }

                            console.log(`Block Tons: ${blockTons}, Revenue: ${revenue}, Total Cost: ${state.totalCost}, Total Revenue: ${state.totalRevenue}`);

                            state.budget -= miningCost;

                            if (value !== 1) {
                                state.budget += revenue;
                            }

                            updateBudgetDisplay();

                            updateStockpileCanvas();
                            generateStockpileReport();
                            generateReport();

                            updateOreRateGraph();
                            updateWasteRateGraph();

                            if (value > 1) {
                                state.intersectedGradeBlocks++;
                                checkFundingCondition();
                            }
                            completeObjective('mine-first-block');

                            // Log values to check calculations
                            console.log('Total Cost:', state.totalCost);
                            console.log('Total Revenue:', state.totalRevenue);
                            console.log('Budget:', state.budget);
                            console.log('Total Ore Tons Mined:', state.totalOreTonsMined);
                            console.log('Total Ore Processing Cost:', state.totalOreProcessingCost);
                        }
                    }, loadAndHaulTime);
                }, 1000);
            }, 1000);
        }
    }


    function checkFundingCondition() {
        // Check if the condition is met and if the popup hasn't already been shown
        if (state.intersectedGradeBlocks >= 10 && !state.fundingPopupShown) {
            elements.getFundingButton.disabled = false;
            state.fundingPopupShown = true;
            showFundingPopup(false);
        }
    }
    
    function showFundingPopup(fundsAdded) {
        const fundingPopup = document.createElement('div');
        fundingPopup.className = 'modal-overlay';
        fundingPopup.innerHTML = `
            <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="funding-title">
                <p class="eyebrow">Project finance</p>
                <h2 id="funding-title">Funding Available</h2>
                <p>${fundsAdded
                    ? 'Funding has been approved and $1 000 000 was added to the project budget.'
                    : 'The drilling campaign has made this project eligible for additional funding.'}</p>
                <button id="close-funding-button" class="button button--primary" type="button">Close</button>
            </div>
        `;
        document.body.appendChild(fundingPopup);
    
        const closeFundingButton = fundingPopup.querySelector('#close-funding-button');
        closeFundingButton.addEventListener('click', () => {
            document.body.removeChild(fundingPopup);
        });
    }
    
    function drawBlock(x, y, color) {
        ctx.clearRect(x, y, state.mineSize, state.mineSize);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, state.mineSize, state.mineSize);
    }

    function conductGeophysicalStudy() {
        console.log("Conducting geophysical study...");
        if (!spendBudget(constants.GEO_COST, 'the geophysical study')) {
            return;
        }
        state.totalExplorationCost += constants.GEO_COST;
        completeObjective('geophysics');

        state.geoStudyResults = [];
        for (let y = 0; y < state.blockSizeHeight; y += state.mineSize) {
            for (let x = 0; x < state.blockSizeWidth; x += state.mineSize) {
                const value = state.originalBlockData[y / state.mineSize][x / state.mineSize];
                if (value > 1) {
                    console.log(`Ore block found at (${x * state.mineSize}, ${y * state.mineSize}) with value ${value}`);
                    const hintX = Math.floor(x / state.mineSize) * state.mineSize;
                    const hintY = 0;
                    if (hintX >= 0 && hintX < state.blockSizeWidth) {
                        state.geoStudyResults.push({ x: hintX, y: hintY });
                        state.explorationLocations.push({ x: hintX, y: hintY });
                        console.log(`Hint at (${hintX}, ${hintY}) for ore block at (${x * state.mineSize}, ${y * state.mineSize})`);
                    }
                }
            }
        }
        console.log("Geophysical study results:", state.geoStudyResults);
        state.geoStudyResults.forEach(result => {
            ctx.strokeStyle = 'blue';
            ctx.beginPath();
            ctx.arc(result.x + state.mineSize / 2, result.y + state.mineSize / 2, state.mineSize / 2, 0, 2 * Math.PI);
            ctx.stroke();
            console.log(`Drawing circle at (${result.x}, ${result.y})`);
        });
        generateReport();
        console.log("Geophysical study completed.");
    }

    function estimateResource() {
        const radius = state.estimateRadius;
        ctx.clearRect(0, 0, state.blockSizeWidth, state.blockSizeHeight);
        const texturePattern = ctx.createPattern(state.textureImage, 'repeat');

        for (let y = 0; y < state.blockSizeHeight; y += state.mineSize) {
            for (let x = 0; x < state.blockSizeWidth; x += state.mineSize) {
                const blockX = x / state.mineSize;
                const blockY = y / state.mineSize;

                // Skip the estimation for depleted blocks
                if (state.blockData[blockY][blockX] === 0) {
                    continue;
                }

                const value = state.originalBlockData[blockY][blockX];
                let withinRadius = false;

                // Check if the block is within the estimation radius
                for (const location of [...state.explorationLocations, ...state.surfaceExplorationLocations, ...state.drillLocations]) {
                    const distance = Math.sqrt(Math.pow(location.x - x, 2) + Math.pow(location.y - y, 2));
                    if (distance <= radius) {
                        withinRadius = true;
                        break;
                    }
                }

                // Set the fill style based on estimation and block type
                if (!withinRadius) {
                    ctx.fillStyle = texturePattern;
                } else {
                    if (value === 5) {
                        const coalGrade = state.blockCoalGrades[blockY][blockX];
                        ctx.fillStyle = (coalGrade > 6000) ? '#FFFFFF' :
                            (coalGrade >= 5000) ? '#A9A9A9' : '#696969';
                    } else if (value > 1) {
                        ctx.fillStyle = state.blockColors[value - 1];
                    } else {
                        ctx.fillStyle = texturePattern;
                    }
                }

                // Draw the block
                ctx.fillRect(x, y, state.mineSize, state.mineSize);
                ctx.strokeStyle = 'black';
                ctx.strokeRect(x, y, state.mineSize, state.mineSize);

                // Add grade text if within radius and non-coal ore block
                if (withinRadius && value > 1 && value !== 5) {
                    const grade = (value === 2) ? 2 : (value === 3) ? 3 : 4;
                    ctx.fillStyle = 'black';
                    ctx.fillText(`${grade}%`, x + state.mineSize / 2 - 5, y + state.mineSize / 2 + 5);
                }
            }
        }
        completeObjective('estimate');
        console.log("Resource estimated.");
    }

    function simulateDrillholes() {
        console.log("Simulate drillholes mode enabled.");
        state.mode = 'drill';
        state.drillStart = null;
    }

    function addDrillhole(startX, startY, endX, endY) {
        // Ensure start and end coordinates are within the canvas bounds
        if (startX < 0 || startX >= blockSizeWidth || startY < 0 || startY >= blockSizeHeight ||
            endX < 0 || endX >= blockSizeWidth || endY < 0 || endY >= blockSizeHeight) {
            console.error(`Invalid drillhole coordinates: start(${startX}, ${startY}), end(${endX}, ${endY})`);
            return;
        }

        let drillLength = Math.sqrt(Math.pow((endX - startX), 2) + Math.pow((endY - startY), 2));
        if (drillLength > state.currentMaxDrillLength) {
            alert(`Drilling length exceeds the maximum allowed length of ${state.currentMaxDrillLength} meters. Drilling to the maximum allowed length.`);
            drillLength = state.currentMaxDrillLength;

            // Calculate the end coordinates based on the maximum allowed length
            const ratio = drillLength / Math.sqrt(Math.pow((endX - startX), 2) + Math.pow((endY - startY), 2));
            endX = startX + (endX - startX) * ratio;
            endY = startY + (endY - startY) * ratio;
        }

        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        state.totalDrilledLength += drillLength;

        // Calculate drilling cost using the constant
        const drillingCost = drillLength * constants.DRILLING_COST_PER_UNIT;
        state.totalDrillingCost += drillingCost;
        state.totalExplorationCost += drillingCost;
        state.totalCost += drillingCost; // Update total cost

        // Highlight intersections with high-value blocks
        const dx = endX - startX;
        const dy = endY - startY;
        const steps = Math.max(Math.abs(dx), Math.abs(dy)) / state.mineSize;

        for (let i = 0; i <= steps; i++) {
            const x = startX + (dx / steps) * i;
            const y = startY + (dy / steps) * i;

            if (x < 0 || x >= blockSizeWidth || y < 0 || y >= blockSizeHeight) {
                continue;
            }

            const blockX = Math.floor(x / state.mineSize);
            const blockY = Math.floor(y / state.mineSize);

            if (blockY >= 0 && blockY < state.originalBlockData.length && blockX >= 0 && blockX < state.originalBlockData[blockY].length) {
                const value = state.originalBlockData[blockY][blockX];

                if (value > 1) {
                    ctx.fillStyle = state.blockColors[value - 1];
                    ctx.fillRect(blockX * state.mineSize, blockY * state.mineSize, state.mineSize, state.mineSize);
                    ctx.fillStyle = 'black';
                    ctx.fillText(value, blockX * state.mineSize + state.mineSize / 2 - 5, blockY * state.mineSize + state.mineSize / 2 + 5);
                    state.totalIntersectedLength += state.mineSize;

                    // Store drill location
                    state.drillLocations.push({ x: blockX * state.mineSize, y: blockY * state.mineSize });

                    // Calculate drilling revenue
                    state.totalDrillingRevenue += revenueValues[value].value * constants.BLOCK_SIZE_TONNES;

                    // Increment intersected grade blocks count
                    state.intersectedGradeBlocks++;
                    checkFundingCondition();
                }
            } else {
                console.error(`Invalid block coordinates: (${blockX}, ${blockY})`);
            }
        }

        // Deplete the budget by the drilling cost
        state.budget -= drillingCost;
        updateBudgetDisplay();
        completeObjective('drill');
        generateReport(); // Update the main report dynamically
    }


    function generateReport() {
        const totalCost = state.totalCost || 0;
        const totalRevenue = state.totalRevenue || 0;
        const profitLoss = totalRevenue - totalCost;

        const oreBlocks = state.blockCounts[2] + state.blockCounts[3] + state.blockCounts[4];
        const strippingRatio = oreBlocks > 0 ? (state.blockCounts[1] / oreBlocks).toFixed(2) : 'N/A';

        const reportContent = `
        <div style="margin-bottom: 10px;"><strong>Total Cost:</strong> $${formatNumber(totalCost.toFixed(2))}</div>
        <div style="margin-bottom: 10px;"><strong>Total Revenue:</strong> $${formatNumber(totalRevenue.toFixed(2))}</div>
        <div style="margin-bottom: 10px;"><strong>Profit/Loss:</strong> $${formatNumber(profitLoss.toFixed(2))}</div>
        <div style="margin-bottom: 10px;"><strong>Stripping Ratio:</strong> ${strippingRatio}</div>
        <div style="margin-top: 20px;"><strong>Blocks Mined:</strong></div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Waste Blocks: ${state.blockCounts[1]}</div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Low Grade Copper: ${state.blockCounts[2]}</div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Med Grade Copper: ${state.blockCounts[3]}</div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- High Grade Copper: ${state.blockCounts[4]}</div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Coal Blocks: ${state.blockCounts[5]}</div>
        <div style="margin-top: 20px;"><strong>Drilling:</strong></div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Total Length Drilled: ${formatNumber((state.totalDrilledLength || 0).toFixed(2))} meters</div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Total Length Intersected: ${formatNumber((state.totalIntersectedLength || 0).toFixed(2))} meters</div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Total Drilling Cost: $${formatNumber((state.totalDrillingCost || 0).toFixed(2))}</div>
        <div style="margin-top: 20px;"><strong>Additional Report:</strong></div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Tons Sent to Mill: ${formatNumber((state.totalOreTonsMined || 0).toFixed(2))} tons</div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Copper Extracted: ${formatNumber((state.totalCopperExtracted || 0).toFixed(2))} tons</div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Waste Mining Cost (OC): $${formatNumber((state.wasteMiningCostOC || 0).toFixed(2))}</div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Waste Mining Cost (UG): $${formatNumber((state.wasteMiningCostUG || 0).toFixed(2))}</div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Ore Mining Cost: $${formatNumber((state.totalOreMiningCost || 0).toFixed(2))}</div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Ore Processing Cost: $${formatNumber((state.totalOreProcessingCost || 0).toFixed(2))}</div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Coal Tons Mined: ${formatNumber((state.totalCoalTonsMined || 0).toFixed(2))} tons</div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Total Ore Tons Mined: ${formatNumber((state.totalOreTonsMined || 0).toFixed(2))} tons</div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Total Waste Tons: ${formatNumber((state.totalWasteTons || 0).toFixed(2))} tons</div>
        <div style="margin-top: 20px;"><strong>Mining Rates:</strong></div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Current Ore Mining Rate: ${formatNumber((state.oreMiningRate || 0).toFixed(2))} tons/day</div>
        <div style="margin-left: 20px; margin-bottom: 5px;">- Current Waste Mining Rate: ${formatNumber((state.wasteMiningRate || 0).toFixed(2))} tons/day</div>
    `;

        elements.reportContainer.innerHTML = reportContent;
    }


    function toggleReportVisibility() {
        if (elements.reportContainer.style.display === 'none' || !elements.reportContainer.style.display) {
            generateReport();
            elements.reportContainer.style.display = 'block';
            elements.drillReportButton.textContent = 'Hide Report';
        } else {
            elements.reportContainer.style.display = 'none';
            elements.drillReportButton.textContent = 'Show Report';
        }
    }

    function generateStockpileReport() {
        let totalOreTons = 0;
        let totalOreGrade = 0;
        state.oreStockpile.forEach(item => {
            totalOreTons += item.tons;
            totalOreGrade += item.grade * item.tons;
        });
        const averageOreGrade = totalOreTons > 0 ? totalOreGrade / totalOreTons : 0;
        const reportContent = `
            <div style="margin-top: 20px;"><strong>Stockpile Report:</strong></div>
            <div>Total Ore Tons: ${formatNumber(totalOreTons.toFixed(2))} tons</div>
            <div>Average Ore Grade: ${averageOreGrade.toFixed(2)}%</div>
            <div>Total Waste Tons: ${formatNumber(state.totalWasteTons.toFixed(2))} tons</div>
        `;
        const stockpileReportContainer = document.getElementById('stockpile-report-container');
        stockpileReportContainer.innerHTML = reportContent;
    }

    function toggleStockpileReport() {
        const stockpileReportContainer = document.getElementById('stockpile-report-container');
        if (stockpileReportContainer.style.display === 'none' || !stockpileReportContainer.style.display) {
            generateStockpileReport();
            stockpileReportContainer.style.display = 'block';
            elements.stockpileReportButton.textContent = 'Hide Stockpile Report';
        } else {
            stockpileReportContainer.style.display = 'none';
            elements.stockpileReportButton.textContent = 'Stockpile Report';
        }
    }

    function addToStockpile(type, tons, grade = 0) {
        if (type === 'ore') {
            state.oreStockpile.push({ tons, grade });
            state.totalOreTons += tons;
            state.totalOreGrade += grade * tons;
        } else {
            state.wasteStockpile.push({ tons });
        }
    }

    function updateStockpileCanvas() {
        stockpileCtx.clearRect(0, 0, elements.stockpileCanvas.width, elements.stockpileCanvas.height);
        const blockHeight = state.mineSize;
        const blockWidth = state.mineSize;
        const canvasWidth = elements.stockpileCanvas.width;
        const blocksPerRow = Math.floor(canvasWidth / blockWidth);
        function drawBlock(x, y, color) {
            stockpileCtx.fillStyle = color;
            stockpileCtx.fillRect(x, y, blockWidth, blockHeight);
            stockpileCtx.strokeStyle = 'black';
            stockpileCtx.strokeRect(x, y, blockWidth, blockHeight);
        }
        let oreCount = 0;
        state.oreStockpile.forEach(item => {
            const color = getGradeColor(item.grade);
            const x = (oreCount % blocksPerRow) * blockWidth;
            const y = elements.stockpileCanvas.height - (Math.floor(oreCount / blocksPerRow) + 1) * blockHeight;
            drawBlock(x, y, color);
            oreCount++;
            console.log(`Ore block at (${x}, ${y}), color: ${color}`);
        });
    }

    function getGradeColor(grade) {
        if (grade > 3) return '#FF6347';
        if (grade > 2) return '#FFD700';
        if (grade > 1) return '#FFA500';
        return '#8B4513';
    }

    function clearStockpileCanvas() {
        const spCanvas = document.getElementById('stockpile-canvas');
        const spCtx = spCanvas.getContext('2d');
        spCtx.clearRect(0, 0, spCanvas.width, spCanvas.height);
    }

    function clearReport() {
        elements.reportContainer.innerHTML = '';
    }

    function resetStockpileReport() {
        const stockpileReportContainer = document.getElementById('stockpile-report-container');
        stockpileReportContainer.innerHTML = '';
    }

    function handleCanvasClick(event) {
        const rect = elements.canvas.getBoundingClientRect();
        const scaleX = elements.canvas.width / rect.width;
        const scaleY = elements.canvas.height / rect.height;
        const canvasX = (event.clientX - rect.left) * scaleX;
        const canvasY = (event.clientY - rect.top) * scaleY;
        const x = Math.floor(canvasX / state.mineSize) * state.mineSize;
        const y = Math.floor(canvasY / state.mineSize) * state.mineSize;
        if (state.mode === 'mineOpenCut') {
            mineBlock(x, y);
        } else if (state.mode === 'mineUnderground') {
            mineBlock(x, y);
        } else if (state.mode === 'drill') {
            if (!state.drillStart) {
                state.drillStart = { x: x, y: y };
                console.log(`Drill start point set at (${x}, ${y})`);
            } else {
                addDrillhole(state.drillStart.x, state.drillStart.y, x, y);
                state.drillStart = null;
                console.log(`Drill end point set at (${x}, ${y})`);
            }
        }
    }

    function calculateLoadAndHaulCost(type, tons) {
        const loadAndHaulCostPerTon = type === 'ore' ? 3.5 : 1.5;
        return loadAndHaulCostPerTon * tons;
    }

    function calculateMiningCost(type, method) {
        const blockVolume = Math.pow(state.mineSize, 3);
        let cost = 0;

        if (type === 'waste') {
            cost = method === 'OC' ? constants.WASTE_MINING_COST_OC * blockVolume : constants.WASTE_MINING_COST_UG * blockVolume;
        } else if (type === 'ore') {
            cost = method === 'OC' ? constants.ORE_MINING_COST_OC * blockVolume : constants.ORE_MINING_COST_UG * blockVolume;
        }

        return cost;
    }

    function canMineUnderground(x, y) {
        if (y === 0) return true;
        const aboveY = y - state.mineSize;
        const leftX = x - state.mineSize;
        const rightX = x + state.mineSize;
        const aboveBlock = aboveY >= 0 ? state.blockData[aboveY / state.mineSize][x / state.mineSize] : 0;
        const leftBlock = leftX >= 0 ? state.blockData[y / state.mineSize][leftX / state.mineSize] : 0;
        const rightBlock = rightX < state.blockSizeWidth ? state.blockData[y / state.mineSize][rightX / state.mineSize] : 0;
        return aboveBlock === 0 || leftBlock === 0 || rightBlock === 0;
    }

    function canMineOpenCut(x, y) {
        if (y === 0) return true;
        const aboveY = y - state.mineSize;
        if (aboveY < 0) return true;
        const aboveLeftX = x - state.mineSize;
        const aboveRightX = x + state.mineSize;
        const aboveBlock = state.blockData[aboveY / state.mineSize][x / state.mineSize];
        const aboveLeftBlock = aboveLeftX >= 0 ? state.blockData[aboveY / state.mineSize][aboveLeftX / state.mineSize] : 0;
        const aboveRightBlock = aboveRightX < state.blockSizeWidth ? state.blockData[aboveY / state.mineSize][aboveRightX / state.mineSize] : 0;
        return aboveBlock === 0 && aboveLeftBlock === 0 && aboveRightBlock === 0;
    }

    function updateMiningRates() {
        if (state.isEngineerHired) {
            const oreRateIncrease = state.totalOreTonsMined * 0.02;
            const wasteRateIncrease = state.totalWasteTons * 0.02;
            state.totalOreTonsMined += oreRateIncrease;
            state.totalWasteTons += wasteRateIncrease;
            console.log('Mining rates updated:', oreRateIncrease, wasteRateIncrease);
            generateReport();
        }
    }

    function getButtonByTextContent(buttonText) {
        const buttons = document.querySelectorAll('.upgrade-button');
        for (const button of buttons) {
            if (button.textContent.trim() === buttonText) {
                return button;
            }
        }
        return null;
    }

    function generateBlockCoalGrades() {
        const grades = [];
        for (let y = 0; y < state.blockSizeHeight; y += state.mineSize) {
            const row = [];
            for (let x = 0; x < state.blockSizeWidth; x += state.mineSize) {
                const value = state.originalBlockData[y / state.mineSize][x / state.mineSize];
                if (value === 5) {
                    const coalGrade = 4000 + Math.random() * 3000;
                    row.push(coalGrade);
                } else {
                    row.push(0);
                }
            }
            grades.push(row);
        }
        return grades;
    }

    // Function to handle hiring a sales specialist

    function hireGeologist() {
        if (!state.isGeologistHired && spendBudget(constants.UPGRADE_GEOLOGIST_COST, 'hiring a geologist')) {
            state.estimateRadius = 70;
            state.isGeologistHired = true;
            markUpgradePurchased(elements.hireGeologistButton);
        }
    }

    function hireSalesSpecialist() {
        if (!state.isSalesSpecialistHired && spendBudget(constants.UPGRADE_SALES_COST, 'hiring a sales specialist')) {
            state.COPPER_PRICE_PER_TON *= 1.05;
            state.isSalesSpecialistHired = true;
            markUpgradePurchased(elements.hireSalesSpecialistButton);
        }
    }
    function hireMetallurgist() {
        if (!state.isMetallurgistHired && spendBudget(constants.UPGRADE_METALLURGIST_COST, 'hiring a metallurgist')) {
            state.recoveryRate += 0.01;
            state.isMetallurgistHired = true;
            markUpgradePurchased(elements.hireMetallurgistButton);
        }
    }
    function hireEngineer() {
        if (!state.isEngineerHired && spendBudget(constants.UPGRADE_ENGINEER_COST, 'hiring an engineer')) {
            state.isEngineerHired = true;
            state.miningRate *= 1.20;
            markUpgradePurchased(hireEngineerButton);
        }
    }

    function upgradeExplorationRigs() {
        if (state.currentMaxDrillLength === constants.INITIAL_MAX_DRILL_LENGTH &&
            spendBudget(constants.UPGRADE_RIGS_COST, 'upgrading the exploration rigs')) {
            state.currentMaxDrillLength = constants.UPGRADED_MAX_DRILL_LENGTH;
            markUpgradePurchased(upgradeExplorationRigsButton);
        }
    }

    function resetSimulation() {
        console.log("Reset button clicked.");
        if (!elements.seedInput.value) {
            state.currentSeed = Math.floor(Math.random() * 100000);
            Math.seedrandom(state.currentSeed);
        }
        initializeBlock();
        state.mode = 'mine';
        console.log("Reset completed. Mine button disabled.");
        state.explorationLocations = [];
        state.drillLocations = [];
        state.oreStockpile = [];
        state.wasteStockpile = [];
        state.totalOreTons = 0;
        state.totalOreGrade = 0;
        state.totalWasteTons = 0;
        state.totalExplorationCost = 0;
        state.budget = constants.INITIAL_BUDGET;
        state.completedObjectives = {};
        state.isDMSPopupShown = false;
        state.intersectedGradeBlocks = 0;
        state.fundingPopupShown = false;
        state.isEngineerHired = false;
        state.isGeologistHired = false;
        state.isMetallurgistHired = false;
        state.isSalesSpecialistHired = false;
        state.estimateRadius = 40;
        state.recoveryRate = 0.90;
        state.COPPER_PRICE_PER_TON = 9000;
        state.miningRate = 1;
        state.currentMaxDrillLength = constants.INITIAL_MAX_DRILL_LENGTH;
        displaySeed();
        updateBudgetDisplay();
        elements.totalResourceValueElement.textContent = '$0.00';
        elements.getFundingButton.disabled = true;
        [elements.drillButton, elements.mineOpenCutButton, elements.mineUndergroundButton]
            .forEach(button => button.classList.remove('selected'));
        [
            [hireEngineerButton, '$250 000'],
            [elements.hireGeologistButton, '$150 000'],
            [elements.hireMetallurgistButton, '$200 000'],
            [elements.hireSalesSpecialistButton, '$200 000'],
            [upgradeExplorationRigsButton, '$300 000']
        ].forEach(([button, label]) => {
            button.classList.remove('is-purchased');
            button.disabled = false;
            const price = button.querySelector('span');
            if (price) {
                price.textContent = label;
            }
        });
        renderObjectives();
        clearReport();
        clearStockpileCanvas();
        resetStockpileReport();
    }

    elements.seedInput.addEventListener('input', () => {
        const newSeed = parseInt(elements.seedInput.value, 10);
        if (!isNaN(newSeed)) {
            elements.seedButton.disabled = false;
        } else {
            elements.seedButton.disabled = true;
        }
    });
});
