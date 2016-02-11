###########################################################################
# nginx Tasks
###########################################################################

namespace :nginx do
  # desc "Create configuration and other files"
  # task :setup do
  #   invoke :sudo
  #   queue echo_cmd "mkdir -p #{nginx_log_path}"
  #   queue echo_cmd "sudo chown #{nginx_user}:#{nginx_group} #{nginx_log_path}"
  # end
  
  desc "Upload and update (link) all nginx config file"
  task :update => [:upload, :link]
  
  desc "Symlink config file"
  task :link do
    queue %{echo "-----> Symlink nginx config file"}
    queue echo_cmd %{sudo ln -fs "#{config_path}/nginx.conf" "#{nginx_config}"}
    queue check_symlink nginx_config
    queue echo_cmd %{sudo ln -fs "#{config_path}/nginx.conf" "#{nginx_config_e}"}
    queue check_symlink nginx_config_e
  end

  desc "Parses nginx config file and uploads it to server"
  task :upload do
    upload_template 'nginx config', "nginx.#{project_type}.conf", "#{config_path}/nginx.conf"
  end
  
  desc "Parses config file and outputs it to STDOUT (local task)"
  task :parse do
    puts "#"*80
    puts "# nginx.conf"
    puts "#"*80
    puts erb("#{config_templates_path}/nginx.#{project_type}.conf.erb")
  end
  
  %w(stop start restart reload status).each do |action|
    desc "#{action.capitalize} Nginx"
    task action.to_sym do
      queue %{echo "-----> #{action.capitalize} Nginx"}
      queue echo_cmd "sudo service nginx #{action}"
    end
  end
end
