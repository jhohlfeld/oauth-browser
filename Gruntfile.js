module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            install: {
                options: {
                    install: false,
                    layout: 'byComponent',
                    targetDir: './src/lib',
                    cleanTargetDir: true,
                    verbose: false
                }
            }
        },
        less: {
            development: {
                options: {
                    paths: [
                        'bower_components/',
                        'src/less/'
                    ]
                },
                files: {
                    'src/css/main.css': 'src/less/main.less'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.registerTask('dev', ['bower:install', 'less:development']);
    grunt.registerTask('default', ['dev']);
};
