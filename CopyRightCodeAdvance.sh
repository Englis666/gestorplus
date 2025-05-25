# Este script ayuda a agregar el aviso de copyright a los archivos que no lo tienen ahora en adelante en la empresa CodeAdvance
# Este script agrega un aviso de copyright a los archivos PHP y JSX en el directorio actual y sus subdirectorios.
# Mayormente se utiliza ya que CodeAdvance no tiene un aviso de copyright en sus archivos
# Ademas es un software hecho a medida para LaFayette, por lo que no se puede redistribuir
# y no se puede usar sin la autorizacion de CodeAdvance

COPYRIGHT="/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */
"

add_copyright() {
  file="$1"
  if ! grep -q "CodeAdvance. Todos los derechos reservados." "$file"; then
    if [[ "$file" == *.php ]]; then
      awk -v copyright="$COPYRIGHT" 'NR==1{print; print copyright; next}1' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    else
      echo "$COPYRIGHT" | cat - "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    fi
    echo "Aviso agregado a $file"
  fi
}

export -f add_copyright
export COPYRIGHT

find . -type f \( -name "*.php" -o -name "*.jsx" \) -exec bash -c 'add_copyright "$0"' {} \;

echo "Proceso completado."