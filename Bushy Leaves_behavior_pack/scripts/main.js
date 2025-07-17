import { world, BlockTypes } from '@minecraft/server';

world.beforeEvents.worldInitialize.subscribe(({ blockComponentRegistry: registry }) => {
    registry.registerCustomComponent('dnn:shear_bushy_leaves', {
        onPlayerInteract({ player, block }) {
            if (!player || !block) return;

            const selectedItem = player.getComponent('equippable').getEquipment('Mainhand');
            if (selectedItem?.typeId !== 'minecraft:shears') return;

            shearBushyLeaves(block);
            selectedItem?.damage?.(1, { type: 'toolUse' });
        },
    });
});

function shearBushyLeaves(block) {
    if (!block.hasTag('dnn:turning_bushy_leaves')) return;

    const customBlock = BlockTypes.get('dnn:azalea_flowered_bushy_leaves');
    block.dimension.getBlock(block.location)?.setType(customBlock);

    block.dimension.spawnParticle('minecraft:block_dust', block.center(), {
        block: 'minecraft:leaves',
        velocity: { x: 0, y: 0.2, z: 0 },
    });

    block.dimension.playSound('minecraft:dig.leaves', block.center(), {
        volume: 1,
        pitch: 1,
    });
}
