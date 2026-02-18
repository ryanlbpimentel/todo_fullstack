const shorthands = undefined;

const up = (pgm) => {

    pgm.addColumn('usuarios', {
        nivel_permissao: { type: 'int', notNull: true, default: '0' },
    });
};

const down = (pgm) => {
    pgm.dropColumn('usuarios', 'nivel_permissao');
};

module.exports = { shorthands, up, down };