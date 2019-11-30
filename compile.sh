src="src/focos.js"
min="dist/latest/focos.min.js"
dist="dist"
tmp="dist/tmp.js"

rm -R $dist;
mkdir $dist;
cd $dist;
mkdir latest;
cd latest;
touch focos.min.js;
cd ../../;
npx babel $src -o $tmp;
npx terser -m -c --ie8 --safari10 $tmp -o $min
rm $tmp;
echo 'done.';
