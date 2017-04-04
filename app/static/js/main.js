const init = () => {
    $.fn.editable.defaults.mode = 'inline';

    $(document).on('ready', () => {
        $.material.init();
    });
};

export default init;
