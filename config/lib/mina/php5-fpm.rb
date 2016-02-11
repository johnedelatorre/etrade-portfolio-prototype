###########################################################################
# PHP5-fpm Tasks
###########################################################################

namespace :fpm do
  desc "Upload and update (link) all php5-fpm config file"
  task :update => [:upload, :link]
  
  desc "Symlink config file"
  task :link do
    queue %{echo "-----> Symlink php5-fpm config file"}
    queue echo_cmd %{sudo ln -fs "#{config_path}/fpm.conf" "#{fpm_config}"}
    queue check_symlink fpm_config
  end

  desc "Parses nginx config file and uploads it to server"
  task :upload do
    upload_template 'fpm config', "fpm.#{project_type}.conf", "#{config_path}/fpm.conf"
  end
  
  desc "Parses config file and outputs it to STDOUT (local task)"
  task :parse do
    puts "#"*80
    puts "# fpm.conf"
    puts "#"*80
    puts erb("#{config_templates_path}/fpm.#{project_type}.conf.erb")
  end

  %w(stop start restart).each do |action|
    desc "#{action.capitalize} php5-fpm"
    task action.to_sym do
      queue %{echo "-----> #{action.capitalize} php5-fpm"}
      queue echo_cmd "sudo service php5-fpm #{action}"
    end
  end
end
