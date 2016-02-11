namespace :env do
  task :prototype => [:environment] do
    set :domain,              'prototype02.etradecreative.com'
    set :user,                'deploy'
    set :group,               'deploy'
    set :rvm_path,          '/home/deploy/.rvm'
    set :rvm,               "#{rvm_path}/scripts/rvm"
    set :nvm_path,          '/home/deploy/.nvm'
    set :nvm,               "#{nvm_path}/nvm.sh"
    # set :rvm_version,          '2.1.2'
    # set :nvm_version,          '0.10.35'
    set :upstart_path,       '/etc/init/'
    set :nginx_path,          '/etc/nginx'
    set :fpm_path,          '/etc/php5/fpm'
    set :deploy_server,       'prototype'
    invoke :defaults
    # invoke :"rvm:use[#{rvm_version}]"
    # invoke :"nvm:use[#{nvm_version}]"
  end
end
