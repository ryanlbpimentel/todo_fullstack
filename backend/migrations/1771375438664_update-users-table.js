export const up = (pgm) => {

    pgm.addColumn('users', {
        permission_level: { type: 'int', notNull: true, default: '0' },
    });
};

export const down = (pgm) => {
    pgm.dropColumn('users', 'permission_level');
};

