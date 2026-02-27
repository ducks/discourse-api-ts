{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_22
    nodePackages.typescript
  ];

  shellHook = ''
    echo "discourse-api-ts dev shell"
    echo "  node: $(node --version)"
    echo "  tsc:  $(tsc --version)"
  '';
}
