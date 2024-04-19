FROM mcr.microsoft.com/devcontainers/typescript-node:20-bookworm

# Terminal setup - Oh my zsh, spaceship prompt
RUN git clone https://github.com/spaceship-prompt/spaceship-prompt.git "/home/node/.oh-my-zsh/custom/themes/spaceship-prompt" --depth=1
RUN ln -s "/home/node/.oh-my-zsh/custom/themes/spaceship-prompt/spaceship.zsh-theme" "/home/node/.oh-my-zsh/custom/themes/spaceship.zsh-theme"
RUN sed -i '/^ZSH_THEME/c\ZSH_THEME="spaceship"' /home/node/.zshrc
RUN echo "SPACESHIP_PROMPT_ASYNC=false\nSPACESHIP_USER_SHOW=always" >> /home/node/.zshrc

# NVM deeper shell integration
COPY ./nvm-zsh.sh /home/node
RUN cat /home/node/nvm-zsh.sh >> /home/node/.zshrc

# ZSH syntax highlight, auto suggest
RUN git clone https://github.com/zsh-users/zsh-syntax-highlighting.git /home/node/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting
RUN git clone https://github.com/zsh-users/zsh-autosuggestions /home/node/.oh-my-zsh/custom/plugins/zsh-autosuggestions

# Apply all ZSH plugins
RUN sed -i "/^plugins=/s/=.*/=(git zsh-syntax-highlighting zsh-autosuggestions)/" /home/node/.zshrc 

CMD ["zsh"]