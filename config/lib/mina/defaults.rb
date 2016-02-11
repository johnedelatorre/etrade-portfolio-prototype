###########################################################################
# Sensible defaults. You wouldn't want to change those in most of the cases
###########################################################################
task :defaults do
  set :term_mode,       :pretty
  # set :rails_env,       'production'
  # set :shared_paths,    ['tmp', 'log']
  set :branch,          'development'
  # set :rvm_string,      nil
  # set :rvm_path,        nil

  # set :sockets_path,    "#{deploy_to}/#{shared_path}/tmp/sockets"
  # set :pids_path,       "#{deploy_to}/#{shared_path}/tmp/pids"
  # set :state,           "#{deploy_to}/#{shared_path}/tmp/state/states"
  set :logs_path,       "#{deploy_to}/#{shared_path}/log"
  set :config_templates_path, "config/lib/mina/templates"
  set :config_path,     "#{deploy_to}/#{shared_path}/config"

  set :upstart_config,  "#{upstart_path}/application-#{app_name!}.conf"
  set :fpm_config,      "#{fpm_path}/pool.d/#{app_name!}.conf"
  set :nginx_config,    "#{nginx_path}/sites-available/#{app_name!}.conf"
  set :nginx_config_e,  "#{nginx_path}/sites-enabled/#{app_name!}.conf"
  set :nginx_log_path,  "/var/log/nginx"
  set :nginx_user,      "deploy"
  set :nginx_group,     "deploy"
  set :nginx_server_name, domain
end
