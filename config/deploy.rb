
require 'mina/bundler'
require 'mina/rails'
require 'mina/git'
require 'mina/rvm'

require_relative 'lib/mina/defaults'
require_relative 'lib/mina/extras'
require_relative 'lib/mina/nginx'
require_relative 'lib/mina/upstart'
require_relative 'lib/mina/puma'
require_relative 'lib/mina/forever'
require_relative 'lib/mina/php5-fpm'
require_relative 'lib/mina/servers/dev'
require_relative 'lib/mina/servers/prototype'

###########################################################################
# Common settings
###########################################################################

set :app_name,        'trading-portfolio'
set :project_type,    'nodejs'
set :build_system,    'grunt'
set :deploy_to,       "/home/deploy/#{project_type}/#{app_name}"
set :repository,      "git@bitbucket.org:etradecreative/#{app_name}.git"
set :default_server,  :prototype

###########################################################################
# Tasks
###########################################################################

set :server, ENV['to'] || default_server
invoke :"env:#{server}"

desc "Deploys the current version to the server."
task :deploy => :environment do
  deploy do
    if project_type == 'static'
      invoke :'git:clone'
      invoke :'deploy'
      to :launch do
        if ['grunt', 'gulp'].include? build_system
          run_build_process(build_system)
        end
        invoke :'nginx:restart'
      end
    elsif project_type == 'nodejs'
      invoke :'git:clone'
      invoke :'deploy'
      to :launch do
        if ['grunt', 'gulp'].include? build_system
          run_build_process(build_system)
        end
	      invoke :'forever:restart'
        invoke :'nginx:restart'
      end
    elsif project_type == 'php'
      invoke :'git:clone'
      invoke :'deploy'
      to :launch do
        invoke :'fpm:restart'
        invoke :'nginx:restart'
      end
    elsif project_type == 'ruby'
      invoke :'git:clone'
      invoke :'deploy:link_shared_paths'
      queue! 'source ~/.bash_profile; bower install'
      invoke :'bundle:install'
      invoke :'rails:db_migrate'
      invoke :'rails:assets_precompile'

      to :launch do
        invoke :'puma:restart'
        invoke :'nginx:restart'
      end
    else
      # provide custom deploy here
      # invoke :'command'
    end
  end
end
