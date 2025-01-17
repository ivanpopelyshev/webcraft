importScripts(
    '../vendors/perlin.js',
    '../vendors/alea.js'
);

function Terrain(seed) {

    const CACTUS_MAX_HEIGHT     = 7;
    const TREE_MIN_HEIGHT       = 4;
    const TREE_MAX_HEIGHT       = 8;
    const TREE_FREQUENCY        = 0.015;

    this.seed                   = seed;
    this.noisefn                = noise.perlin3;
    this.maps_cache             = {};

    noise.seed(this.seed);

    this.BIOMES = {};
    this.BIOMES.OCEAN = {
        code:       'OCEAN',
        color:      '#017bbb',
        title:      'ОКЕАН',
        dirt_block: blocks.SAND,
        trees:      {
            frequency: 0,
            list: []
        },
        plants: {
            frequency: 0,
            list: []
        }
    };
    this.BIOMES.BEACH = {
        code:       'BEACH',
        color:      '#ffdc7f',
        title:      'ПЛЯЖ',
        dirt_block: blocks.SAND,
        trees:      {
            frequency: 0,
            list: []
        },
        plants: {
            frequency: .005,
            list: [
                {percent: 1, block: blocks.DEAD_BUSH}
            ]
        }
    };
    this.BIOMES.TEMPERATE_DESERT = {
        code:       'TEMPERATE_DESERT',
        color:      '#f4a460',
        title:      'УМЕРЕННАЯ ПУСТЫНЯ',
        dirt_block: blocks.SAND,
        trees:      {
            frequency: TREE_FREQUENCY / 2,
            list: [
                {percent: 1, trunk: blocks.CACTUS, leaves: null, style: 'cactus', height: {min: TREE_MIN_HEIGHT, max: CACTUS_MAX_HEIGHT}}
            ]
        },
        plants: {
            frequency: .005,
            list: [
                {percent: 1, block: blocks.DEAD_BUSH}
            ]
        }
    };
    this.BIOMES.SUBTROPICAL_DESERT = {
        code:       'SUBTROPICAL_DESERT',
        color:      '#c19a6b',
        title:      'СУБТРОПИЧЕСКАЯ ПУСТЫНЯ',
        dirt_block: blocks.DIRT,
        trees:      {
            frequency: TREE_FREQUENCY,
            list: [
                {percent: 0.01, trunk: blocks.WOOD, leaves: blocks.RED_MUSHROOM, style: 'stump', height: {min: 1, max: 1}},
                {percent: 0.99, trunk: blocks.WOOD, leaves: blocks.WOOD_LEAVES, style: 'wood', height: {min: TREE_MIN_HEIGHT, max: TREE_MAX_HEIGHT}}
            ]
        },
        plants: {
            frequency: .005,
            list: [
                {percent: 1, block: blocks.DEAD_BUSH}
            ]
        }
    };
    this.BIOMES.SCORCHED = {
        code:       'SCORCHED',
        color:      '#ff5500',
        title:      'ОБОГРЕВАЮЩИЙ',
        dirt_block: blocks.SAND,
        trees:      {frequency: 0},
        plants:     {frequency: 0}
    };
    this.BIOMES.BARE = {
        code:       'BARE',
        color:      '#CCCCCC',
        title:      'ПУСТОШЬ',
        dirt_block: blocks.CONCRETE,
        trees:      {},
        plants:     {frequency: 0}
    };
    this.BIOMES.TUNDRA = {
        code:       'TUNDRA',
        color:      '#74883c',
        title:      'ТУНДРА',
        dirt_block: blocks.DIRT,
        trees:      {
            frequency: TREE_FREQUENCY,
            list: [
                {percent: 0.01, trunk: blocks.WOOD, leaves: blocks.RED_MUSHROOM, style: 'stump', height: {min: 1, max: 1}},
                {percent: 0.99, trunk: blocks.SPRUCE, leaves: blocks.SPRUCE_LEAVES, style: 'spruce', height: {min: 7, max: TREE_MAX_HEIGHT}}
            ]
        },
        plants: {
            frequency: TREE_FREQUENCY,
            list: [
                {percent: 1, block: blocks.BROWN_MUSHROOM}
            ]
        }
    };
    this.BIOMES.TAIGA = {
        code:       'TAIGA',
        color:      '#879b89',
        title:      'ТАЙГА',
        dirt_block: blocks.DIRT,
        trees:      {
            frequency: TREE_FREQUENCY,
            list: [
                {percent: 0.01, trunk: blocks.WOOD, leaves: blocks.RED_MUSHROOM, style: 'stump', height: {min: 1, max: 1}},
                {percent: 0.99, trunk: blocks.SPRUCE, leaves: blocks.SPRUCE_LEAVES, style: 'spruce', height: {min: 7, max: TREE_MAX_HEIGHT}}
            ]
        },
        plants: {
            frequency: 0,
            list: []
        }
    };
    this.BIOMES.SNOW = {
        code:       'SNOW',
        color:      '#f5f5ff',
        title:      'СНЕГ',
        dirt_block: blocks.SNOW_DIRT,
        trees:      {
            frequency: TREE_FREQUENCY,
            list: [
                {percent: 0.01, trunk: blocks.WOOD, leaves: blocks.RED_MUSHROOM, style: 'stump', height: {min: 1, max: 1}},
                {percent: 0.99, trunk: blocks.SPRUCE, leaves: blocks.SPRUCE_LEAVES, style: 'spruce', height: {min: 7, max: TREE_MAX_HEIGHT}}
            ]
        },
        plants: {
            frequency: 0,
            list: []
        }
    };
    this.BIOMES.SHRUBLAND = {
        code:       'SHRUBLAND',
        color:      '#316033',
        title:      'КУСТАРНИКИ',
        dirt_block: blocks.DIRT,
        trees:      {frequency: 0},
        plants: {
            frequency: .3,
            list: [
                {percent: 1, block: blocks.GRASS}
            ]
        }
    };
    this.BIOMES.GRASSLAND = {
        code:       'GRASSLAND',
        color:      '#98a136',
        title:      'ТРАВЯНАЯ ЗЕМЛЯ',
        dirt_block: blocks.DIRT,
        trees:      {frequency: 0},
        plants: {
            frequency: .5,
            list: [
                {percent: .95, block: blocks.GRASS},
                {percent: .025, block: blocks.TULIP},
                {percent: .025, block: blocks.DANDELION}
            ]
        }
    };
    this.BIOMES.TEMPERATE_DECIDUOUS_FOREST = {
        code:       'TEMPERATE_DECIDUOUS_FOREST',
        color:      '#228b22',
        title:      'УМЕРЕННЫЙ ЛИСТЫЙ ЛЕС',
        dirt_block: blocks.DIRT,
        trees:      {
            frequency: TREE_FREQUENCY,
            list: [
                {percent: 0.01, trunk: blocks.WOOD, leaves: blocks.RED_MUSHROOM, style: 'stump', height: {min: 1, max: 1}},
                {percent: 0.99, trunk: blocks.WOOD_BIRCH, leaves: blocks.WOOD_LEAVES, style: 'wood', height: {min: TREE_MIN_HEIGHT, max: TREE_MAX_HEIGHT}}
            ]
        },
        plants: {
            frequency: .3,
            list: [
                {percent: .975, block: blocks.GRASS},
                {percent: .025, block: blocks.RED_MUSHROOM}
            ]
        }
    };
    this.BIOMES.TEMPERATE_RAIN_FOREST = {
        code:       'TEMPERATE_RAIN_FOREST',
        color:      '#00755e',
        title:      'УМЕРЕННЫЙ ДОЖДЬ ЛЕС',
        dirt_block: blocks.DIRT,
        trees:      {
            frequency: TREE_FREQUENCY * 2,
            list: [
                {percent: 0.01, trunk: blocks.WOOD, leaves: blocks.RED_MUSHROOM, style: 'stump', height: {min: 1, max: 1}},
                {percent: 0.99, trunk: blocks.WOOD, leaves: blocks.WOOD_LEAVES, style: 'wood', height: {min: TREE_MIN_HEIGHT, max: TREE_MAX_HEIGHT}}
            ]
        },
        plants: {
            frequency: 0,
            list: []
        }
    };
    this.BIOMES.TROPICAL_SEASONAL_FOREST = {
        code:       'TROPICAL_SEASONAL_FOREST',
        color:      '#008456',
        title:      'ТРОПИЧЕСКИЙ СЕЗОННЫЙ ЛЕС',
        dirt_block: blocks.DIRT,
        trees:      {
            frequency: TREE_FREQUENCY * 2,
            list: [
                {percent: 0.01, trunk: blocks.WOOD, leaves: blocks.RED_MUSHROOM, style: 'stump', height: {min: 1, max: 1}},
                {percent: 0.99, trunk: blocks.WOOD, leaves: blocks.WOOD_LEAVES, style: 'wood', height: {min: TREE_MIN_HEIGHT, max: TREE_MAX_HEIGHT}}
            ]
        },
        plants: {
            frequency: 0,
            list: []
        }
    };
    this.BIOMES.TROPICAL_RAIN_FOREST = {
        code:       'TROPICAL_RAIN_FOREST',
        color:      '#16994f',
        title:      'ТРОПИЧЕСКИЙ ЛЕС',
        dirt_block: blocks.DIRT,
        trees:      {
            frequency: TREE_FREQUENCY,
            list: [
                {percent: 0.01, trunk: blocks.WOOD, leaves: blocks.RED_MUSHROOM, style: 'stump', height: {min: 1, max: 1}},
                {percent: 0.99, trunk: blocks.SPRUCE, leaves: blocks.SPRUCE_LEAVES, style: 'spruce', height: {min: 7, max: TREE_MAX_HEIGHT}}
            ]
        },
        plants: {
            frequency: 0,
            list: []
        }
    };
}

// generateMap
Terrain.prototype.generateMap = function(chunk, noisefn, signal) {

    if(this.maps_cache.hasOwnProperty(chunk.id)) {
        return this.maps_cache[chunk.id];
    }

    const clamp                 = this.clamp;
    const SX                    = chunk.coord.x;
    const SZ                    = chunk.coord.z;
    const aleaRandom            = new alea(chunk.seed + '_' + chunk.id);

    var scale = .5;

    // Настройки
    const options = {
        WATER_LINE:             63, // Ватер-линия
        SCALE_EQUATOR:          1280 * scale, // Масштаб для карты экватора
        SCALE_BIOM:             640  * scale, // Масштаб для карты шума биомов
        SCALE_HUMIDITY:         320  * scale, // Масштаб для карты шума влажности
        SCALE_VALUE:            250  * scale // Масштаб шума для карты высот
    };

    // Result map
    var map = {
        options:    options,
        // top_dirts:  [],
        trees:      [],
        plants:     [],
        cells:      Array(chunk.size.x).fill(null).map(el => Array(chunk.size.z).fill(null))
    };

    //
    for(var x = 0; x < chunk.size.x; x++) {
        for(var z = 0; z < chunk.size.z; z++) {

            var px = (x + SX);
            var pz = (z + SZ);

            // Влажность
            var humidity = clamp(noisefn(px / options.SCALE_HUMIDITY, pz / options.SCALE_HUMIDITY, 0) + 0.6);
            // Экватор
            var equator = clamp(noisefn(px / options.SCALE_EQUATOR, pz / options.SCALE_EQUATOR, 0) + 0.6);

            // Высота
            var value = (
                noisefn(px / options.SCALE_VALUE, pz / options.SCALE_VALUE, 0) + // равнины
                0
                // noisefn(px / (options.SCALE_VALUE / 2), pz / (options.SCALE_VALUE / 2), 0)
                // noisefn(px / options.SCALE_BIOM, pz / options.SCALE_BIOM, 0)
            ) / 1;

            // Шум биома (biome noise)
            var bn = clamp(noisefn(px / (options.SCALE_VALUE * 8), pz / (options.SCALE_VALUE * 8), 0) + 0.6, 0.1, 1);
            value *= (1. + bn / 2);

            if(value < 0) {
                value /= 4;
            }
            value += 0.2;
            value = parseInt(value * 256) + 4;
            value = clamp(value, 4, 255);
            value = signal[value];

            if(value < options.WATER_LINE) {
                value = Math.round(options.WATER_LINE - (options.WATER_LINE - value) * 0.5);
            }

            // Get biome
            var biome = this.getBiome(value / 255, humidity, equator);

            // Если наверху блок земли
            if([biome.dirt_block.id].indexOf(biome.dirt_block.id) >= 0) {
                // map.top_dirts.push(new Vector(x, value, z));
                // Динамическая рассадка растений
                var rnd = aleaRandom.double();
                if(rnd > 0 && rnd <= biome.plants.frequency) {
                    var s = 0;
                    var r = rnd / biome.plants.frequency;
                    for(var p of biome.plants.list) {
                        s += p.percent;
                        if(r < s) {
                            map.plants.push({
                                pos: new Vector(x, value, z),
                                block: p.block
                            });
                            break;
                        }
                    }
                }
                // Посадка деревьев
                if(rnd > 0 && rnd <= biome.trees.frequency) {
                    var s = 0;
                    var r = rnd / biome.trees.frequency;
                    for(var type of biome.trees.list) {
                        s += type.percent;
                        if(r < s) {
                            const height = clamp(Math.round(aleaRandom.double() * type.height.max), type.height.min, type.height.max);
                            const rad = Math.max(parseInt(height / 2), 2);
                            map.trees.push({
                                pos:    new Vector(x, value, z),
                                height: height,
                                rad:    rad,
                                type:   type
                            });
                            break;
                        }
                    }
                }
            }

            map.cells[x][z] = {
                value:      value,
                humidity:   humidity,
                equator:    equator,
                bn:         bn,
                biome:      {code: biome.code, color: biome.color, title: biome.title, dirt_block: biome.dirt_block},
                block:      biome.dirt_block
            };

            if(biome.code == 'OCEAN') {
                map.cells[x][z].block = blocks.STILL_WATER;
            }

            // @todo: Если это снежный биом, то верхний слой делаем принудительно снегом

        }
    }

    // Clear maps_cache
    var entrs = Object.entries(this.maps_cache);
    var MAX_ENTR = 2000;
    if(entrs.length > MAX_ENTR) {
        var del_count = Math.floor(entrs.length - MAX_ENTR * 0.333);
        console.info('Clear maps_cache, del_count: ' + del_count);
        for(const [k, v] of entrs) {
            if(--del_count == 0) {
                break;
            }
            delete(this.maps_cache[k]);
        }
    }

    //
    return this.maps_cache[chunk.id] = map;

}


Terrain.prototype.generateMaps = function(chunk) {
    const noisefn               = this.noisefn;
    const signal                = this.makeSignal(115, 10);
    var maps                    = [];
    for(var x = -1; x <= 1; x++) {
        for(var z = -1; z <= 1; z++) {
            const addr = new Vector(
                chunk.addr.x + x,
                chunk.addr.y,
                chunk.addr.z + z
            );
            const c = {
                seed: chunk.seed,
                addr: addr,
                size: new Vector(
                    CHUNK_SIZE_X,
                    CHUNK_SIZE_Y,
                    CHUNK_SIZE_Z
                ),
                coord: new Vector(
                    addr.x * CHUNK_SIZE_X,
                    addr.y * CHUNK_SIZE_Y,
                    addr.z * CHUNK_SIZE_Z
                ),
            };
            c.id = [
                c.addr.x,
                c.addr.y,
                c.addr.z,
                c.size.x,
                c.size.y,
                c.size.z
            ].join('_');
            var item = {
                chunk: c,
                info: this.generateMap(c, noisefn, signal)
            };
            maps.push(item);
            if(x == 0 && z == 0) {
                map = item;
            }            
        }
    }
    return maps;
}


// Generate
Terrain.prototype.generate = function(chunk) {

    const seed                  = chunk.id;
    const seedn                 = 0;
    const amplitude             = 24;
    const aleaRandom            = new alea(seed);
    const noisefn               = this.noisefn;

    // maps
    // var map                     = null;
    // var maps                    = [];

    var maps = this.generateMaps(chunk);
    var map = maps[4];

    //
    for(var x = 0; x < chunk.size.x; x++) {
        for(var z = 0; z < chunk.size.z; z++) {

            // AIR
            chunk.blocks[x][z] = Array(chunk.size.y).fill(null);

            // Bedrock
            chunk.blocks[x][z][0] = blocks.BEDROCK;

            // chunk.blocks[x][z][1] = blocks.DIRT;
            // continue;

            const cell = map.info.cells[x][z];
            const biome = cell.biome;
            const value = cell.value;

            var ar = aleaRandom.double();
            var rnd = ar * cell.bn;

            // Sin wave
            var px = (x + chunk.coord.x);
            var pz = (z + chunk.coord.z);
            for(var y = 4; y < 4 + Math.abs((Math.sin(px / 8) + Math.cos(pz / 8)) * 3); y++) {
                chunk.blocks[x][z][y] = blocks.CONCRETE;
            }

            for(var y = 1; y < value; y++) {

                /*if(y > 5 && ['OCEAN', 'BEACH'].indexOf(biome.code) < 0) {
                    var noiseScale  = 10; // map.info.options.SCALE_VALUE;
                    var px          = (x + chunk.coord.x);
                    var py          = (y + chunk.coord.y);
                    var pz          = (z + chunk.coord.z);
                    let xNoise      = noisefn(py / noiseScale, pz / noiseScale, seedn) * amplitude;
                    let yNoise      = noisefn(px / noiseScale, pz / noiseScale, seedn) * amplitude;
                    let zNoise      = noisefn(px / noiseScale, py / noiseScale, seedn) * amplitude;
                    let density     = xNoise + yNoise + zNoise; // + (py / 4);
                    if (density > 2 && density < 50) {
                        continue;
                    }
                }*/

                var r = aleaRandom.double() * 1.33;
                if(y < value - (rnd < .005 ? 0 : 2)) {
                    // если это не вода, то заполняем полезными ископаемыми
                    if(r < 0.0025 && y < value - 5) {
                        chunk.blocks[x][z][y] = blocks.DIAMOND_ORE;
                    } else if(r < 0.01) {
                        chunk.blocks[x][z][y] = blocks.COAL_ORE;
                    } else {
                        var norm = true;
                        for(var plant of map.info.plants) {
                            if(plant.pos.x == x && plant.pos.z == z && y == plant.pos.y - 1) {
                                norm = false;
                                break;
                            }
                        }
                        chunk.blocks[x][z][y] = norm ? blocks.CONCRETE : biome.dirt_block;
                    }
                } else {
                    if(biome.code == 'OCEAN' && r < .1) {
                        chunk.blocks[x][z][y] = blocks.GRAVEL;
                    } else {
                        chunk.blocks[x][z][y] = biome.dirt_block;
                    }
                }
            }

            if(biome.code == 'OCEAN') {
                chunk.blocks[x][z][map.info.options.WATER_LINE] = blocks.STILL_WATER;
            }

        }
    }

    /*
    const tree_types = [
        {style: 'spruce', trunk: blocks.SPRUCE, leaves: blocks.SPRUCE_LEAVES, height: 7},
        {style: 'wood', trunk: blocks.WOOD, leaves: blocks.WOOD_LEAVES, height: 5},
        {style: 'stump', trunk: blocks.WOOD, leaves: blocks.RED_MUSHROOM, height: 1},
        {style: 'cactus', trunk: blocks.CACTUS, leaves: null, height: 5},
    ];

    var x = 8;
    var z = 8;
    var type = tree_types[chunk.addr.x % tree_types.length];
    var tree_options = {
        type: type,
        height: type.height,
        rad: 4,
        pos: new Vector(x, 2, z)
    };
    this.plantTree(
        tree_options,
        chunk,
        tree_options.pos.x,
        tree_options.pos.y,
        tree_options.pos.z,
    );

    return map;
    */

    // Plant plants
    for(var p of map.info.plants) {
        var b = chunk.blocks[p.pos.x][p.pos.z][p.pos.y - 1];
        if(b && b.id == blocks.DIRT.id) {
            chunk.blocks[p.pos.x][p.pos.z][p.pos.y] = p.block;
        }
    }

    // Plant trees
    for(const m of maps) {
        for(var p of m.info.trees) {
            // m.chunk.blocks[p.pos.x][p.pos.z][p.pos.y - 1] = blocks.DIRT;
            this.plantTree(
                p,
                chunk,
                m.chunk.coord.x + p.pos.x - chunk.coord.x,
                m.chunk.coord.y + p.pos.y - chunk.coord.y,
                m.chunk.coord.z + p.pos.z - chunk.coord.z
            );
        }
    }

    return map;

}

// plantTree...
Terrain.prototype.plantTree = function(options, chunk, x, y, z) {

    const height        = options.height;
    const type          = options.type;
    const leaves_rad    = options.rad;
    var ystart = y + height;

    // ствол
    for(var p = y; p < ystart; p++) {
        if(chunk.getBlock(x + chunk.coord.x, p + chunk.coord.y, z + chunk.coord.z).id >= 0) {
            if(x >= 0 && x < chunk.size.x && z >= 0 && z < chunk.size.z) {
                chunk.blocks[x][z][p] = type.trunk;
            }
        }
    }

    // листва над стволом
    switch(type.style) {
        case 'cactus': {
            // кактус
            break;
        }
        case 'stump': {
            // пенёк
            if(x >= 0 && x < chunk.size.x && z >= 0 && z < chunk.size.z) {
                chunk.blocks[x][z][ystart] = type.leaves;
            }
            break;
        }
        case 'wood': {
            // дуб, берёза

            var py = y + height;
            for(var rad of [1, 1, 2, 2]) {
                for(var i = x - rad; i <= x + rad; i++) {
                    for(var j = z - rad; j <= z + rad; j++) {
                        if(i >= 0 && i < chunk.size.x && j >= 0 && j < chunk.size.z) {
                            var m = (i == x - rad && j == z - rad) ||
                                (i == x + rad && j == z + rad) || 
                                (i == x - rad && j == z + rad) ||
                                (i == x + rad && j == z - rad);
                            var m2 = (py == y + height) ||
                                (i + chunk.coord.x + j + chunk.coord.z + py) % 3 > 0;
                            if(m && m2) {
                                    continue;
                            }
                            var b = chunk.blocks[i][j][py];
                            // var b = chunk.getBlock(i + chunk.coord.x, p + chunk.coord.y, j + chunk.coord.z);
                            if(!b || b.id >= 0 && b.id != type.trunk.id) {
                                chunk.blocks[i][j][py] = type.leaves;
                            }
                        }
                    }
                }
                py--;
            }

            /*
            for(var p = ystart - leaves_rad; p <= ystart + leaves_rad; p++) {
                var max = leaves_rad * 2;
                var perc = (p - (ystart - leaves_rad)) / max;
                var rad = parseInt(Math.abs(Math.sin(perc * Math.PI * 2) * (leaves_rad * (1 - perc))));
                rad = Math.max(rad, 2);
                for(var i = x - rad; i <= x + rad; i++) {
                    for(var j = z - rad; j <= z + rad; j++) {
                        if(i >= 0 && i < chunk.size.x && j >= 0 && j < chunk.size.z) {
                            if(Math.sqrt(Math.pow(x - i, 2) + Math.pow(z - j, 2) + Math.pow(ystart - p, 2)) <= rad) {
                                var b = chunk.getBlock(i + chunk.coord.x, p + chunk.coord.y, j + chunk.coord.z);
                                if(b.id >= 0 && b.id != type.trunk.id) {
                                    chunk.blocks[i][j][p] = type.leaves;
                                }
                            }
                        }
                    }
                }
            }
            */
            break;
        }
        case 'spruce': {
            
            // ель
            var r = 1;
            var rad = Math.round(r);
            if(x >= 0 && x < chunk.size.x && z >= 0 && z < chunk.size.z) {
                chunk.blocks[x][z][ystart] = type.leaves;
            }
            var step = 0;
            for(var y = ystart - 1; y > ystart - (height - 1); y--) {
                if(step++ % 2 == 0) {
                    rad = Math.min(Math.round(r), 3);
                } else {
                    rad = 1;
                }
                for(var i = x - rad; i <= x + rad; i++) {
                    for(var j = z - rad; j <= z + rad; j++) {
                        if(i >= 0 && i < chunk.size.x && j >= 0 && j < chunk.size.z) {
                            if(rad == 1 || Math.sqrt(Math.pow(x - i, 2) + Math.pow(z - j, 2)) <= rad) {
                                var b = chunk.getBlock(i + chunk.coord.x, p + chunk.coord.y, j + chunk.coord.z);
                                if(b.id == blocks.AIR.id) {
                                    chunk.blocks[i][j][y] = type.leaves;
                                }
                            }
                        }
                    }
                }
                r += .9;
            }
            break;
        }
    }

}

// clamp
Terrain.prototype.clamp = function(x, min, max) {
    if(!min) {
        min = 0;
    }
    if(!max) {
        max = 1;
    }
    if(x < min) return min;
    if(x > max) return max;
    return x;
}
    
/**
* Функция определения биома в зависимости от возвышенности, влажности и отдаленности от экватора
*/
Terrain.prototype.getBiome = function(height, humidity, equator) {
    
    function _(humidity, height, equator) {
        /*
        if(equator > .7) {
            if (equator < .9) return 'OCEAN';
            if (equator < .92 && humidity < .5) return 'TUNDRA';
            return 'SNOW';
        }
        */
        // if (h < 0.1) return 'OCEAN';
        // if (h < 0.12) return 'BEACH';
        if (height < 0.248) return 'OCEAN';
        if (height < 0.265) return 'BEACH';
        if (height > 0.8) {
            if (humidity < 0.1) return 'SCORCHED';
            if (humidity < 0.2) return 'BARE';
            if (humidity < 0.5) return 'TUNDRA';
            return 'SNOW';
        }
        if (height > 0.6) {
            if (humidity < 0.33) return 'TEMPERATE_DESERT'; // УМЕРЕННАЯ ПУСТЫНЯ
            if (humidity < 0.66) return 'SHRUBLAND'; // кустарник
            return 'TAIGA';
        }
        if (height > 0.3) {
            if (humidity < 0.16) return 'TEMPERATE_DESERT'; // УМЕРЕННАЯ ПУСТЫНЯ
            if (humidity < 0.50) return 'GRASSLAND';
            if (humidity < 0.83) return 'TEMPERATE_DECIDUOUS_FOREST'; // УМЕРЕННЫЙ ЛИСТЫЙ ЛЕС
            return 'TEMPERATE_RAIN_FOREST'; // УМЕРЕННЫЙ ДОЖДЬ ЛЕС
        }
        if (humidity < 0.16) return 'SUBTROPICAL_DESERT';
        if (humidity < 0.33) return 'GRASSLAND';
        if (humidity < 0.66) return 'TROPICAL_SEASONAL_FOREST';
        return 'TROPICAL_RAIN_FOREST';
    }

    var b = _(humidity, height, equator);
    return this.BIOMES[b];

}

// Make signal
Terrain.prototype.makeSignal = function(w, h) {
    w = 0;
    h = 0;
    // minimum two points
    var myPoints = [
        0.01,   0,
        0.3,    0,
        0.35,   0,
        0.45,   0,
        1.0,    0,
    ];
    const tension = 0.5;
    var curve = this.getCurvePoints(myPoints, 0, false, 63);
    var signal = [];
    for(var i = 0; i < 256; i++) {
        signal.push(parseInt(curve[i * 2] * 255));
    }
    return signal;
}

// getCurvePoints
Terrain.prototype.getCurvePoints = function(pts, tension, isClosed, numOfSegments) {
    // use input value if provided, or use a default value   
    tension = (typeof tension != 'undefined') ? tension : 0.5;
    isClosed = isClosed ? isClosed : false;
    numOfSegments = numOfSegments ? numOfSegments : 16;
    var _pts = [], res = [],    // clone array
        x, y,                   // our x,y coords
        t1x, t2x, t1y, t2y,     // tension vectors
        c1, c2, c3, c4,         // cardinal points
        st, t, i;               // steps based on num. of segments
    // clone array so we don't change the original
    _pts = pts.slice(0);
    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if (isClosed) {
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.push(pts[0]);
        _pts.push(pts[1]);
    } else {
        _pts.unshift(pts[1]);   //copy 1. point and insert at beginning
        _pts.unshift(pts[0]);
        _pts.push(pts[pts.length - 2]); //copy last point and append
        _pts.push(pts[pts.length - 1]);
    }
    // ok, lets start..
    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i=2; i < (_pts.length - 4); i+=2) {
        for (t=0; t <= numOfSegments; t++) {
            // calc tension vectors
            t1x = (_pts[i+2] - _pts[i-2]) * tension;
            t2x = (_pts[i+4] - _pts[i]) * tension;
            t1y = (_pts[i+3] - _pts[i-1]) * tension;
            t2y = (_pts[i+5] - _pts[i+1]) * tension;
            // calc step
            st = t / numOfSegments;
            // calc cardinals
            c1 =   2 * Math.pow(st, 3)  - 3 * Math.pow(st, 2) + 1; 
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
            c3 =       Math.pow(st, 3)  - 2 * Math.pow(st, 2) + st; 
            c4 =       Math.pow(st, 3)  -     Math.pow(st, 2);
            // calc x and y cords with common control vectors
            x = c1 * _pts[i]    + c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
            y = c1 * _pts[i+1]  + c2 * _pts[i+3] + c3 * t1y + c4 * t2y;
            // store points in array
            res.push(x);
            res.push(y);

        }
    }
    return res;
}
