for file in "$@"
do
    #echo $file
    uglifyjs --source-map-url ${file/js/min.map} --screw-ie8 --mangle -o ${file/js/min.js} --source-map ${file/js/min.map} --compress unused=false -- $file
    #echo ${f/js/min.js}
done
