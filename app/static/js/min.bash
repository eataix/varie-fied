for file in "$@"
do
    #echo $file
    uglifyjs --mangle -o ${file/js/min.js} --compress unused=false -- $file
    #echo ${f/js/min.js}
done
