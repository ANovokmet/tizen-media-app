<script>
  import 'video.js/dist/video-js.css';
  import videojs from 'video.js';
  import { onDestroy, onMount } from 'svelte';
  import SRows from './lib/SRows.svelte';
  import SRow from './lib/SRow.svelte';
  import SItem from './lib/SItem.svelte';
  import * as api from './api';
  import * as states from './states';


  let videoElement;
  /** @type {ReturnType<import('video.js').default>} */  
  let player;
  onMount(() => {
    player = videojs(videoElement, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      playbackRates: [0.5, 1, 1.5, 2],
    });

    // player.src({type: 'video/mp4', src: 'file_example_MP4_640_3MG.mp4'});

    player.ready(() => {
      console.log('player is ready', player);
      states.go('playing');
    });
  });

  let currentFolder = '.';
  let currentFolderData = { path: '', contents: [] };
  $: {
    api.getList(currentFolder).then(data => {
      currentFolderData = data;
    });
  }

  const options = [
    { 
      name: 'playback rate',
      values: [1, 1.25, 1.5, 1.75, 2],
      select(value, opt) {
        console.log('playback rate', value, opt);
        player.playbackRate(value);
        opt.selected = value;
      },
      active(value) {
        player && player.playbackRate() == value;
      },
    }
  ];

  function onSelectFile(item) {
    console.log('onSelectFile', item);
    if (item && !item.directory) {
      states.exec('src', item);
      states.go('playing');
    }

    if (item && item.directory) {
      currentFolder = item.fullPath;
    }
  }

  states.registerAction('src', (item) => {
    states.setState({ activeSrc: item });
    player.src({
      type: 'video/mp4',
      src: api.getVideoUrl(item),
    });
  });

  states.registerAction('forward', () => {
    player.currentTime(player.currentTime() + 10);
  });
  states.registerAction('rewind', () => {
    player.currentTime(player.currentTime() - 10);
  });
  states.registerAction('pause', () => {
    player.pause();
  });
  states.registerAction('play', () => {
    player.play();
  });

  const current = states.currentStateId;
  const stateVars = states.stateVars;
</script>

<main>
  <video class="p-video video-js full-screen" bind:this={videoElement}>
  </video>

  {#if $current === 'options'}
  <SRows>
    <div class="p-options full-screen">
      
      <SRow on:ok="{() => states.go('menu')}" let:selected>
        <div class="p-close options__value" class:selected>close</div>
      </SRow>

      {#each options as option, i}
      <SRow>
        <div class="p-option">
          {option.name}
          <div class="options__values">
            {#each option.values as val}
            <SItem on:ok="{() => option.select(val, option)}" let:selected>
              {option.selected}
              <div class="options__value" class:selected class:active="{option.selected === val}">
                {val}
              </div>
            </SItem>
            {/each}
          </div>
        </div>
      </SRow>
      {/each}

    </div>
  </SRows>
  {/if}

  {#if $current === 'menu'}
  <SRows>
    <div class="p-options full-screen">
      <SRow on:ok="{() => states.go('options')}" let:selected>
        <div class="p-close options__value" class:selected>options</div>
      </SRow>
      <SRow on:ok="{() => states.go('browser')}" let:selected>
        <div class="p-close options__value" class:selected>browser</div>
      </SRow>
    </div>
  </SRows>
  {/if}

  {#if $current === 'browser'}
  <div class="p-file-browser full-screen">
    <div class="p-content__item">
      {currentFolderData.path}
    </div>
    <SRows>
      <div class="p-content">
        {#each currentFolderData.contents as item, i}
        <SRow let:selected on:ok="{() => onSelectFile(item)}">
          <div class="p-content__item" class:selected class:active="{$stateVars.activeSrc && $stateVars.activeSrc.fullPath == item.fullPath}">
            {item.name}
          </div>
        </SRow>
        {/each}
      </div>
    </SRows>
  </div>
  {/if}
</main>

<style>
  .options__values {
    display: flex;
    gap: 0.5rem;
  }

  .options__value {
    min-width: 20px;
    text-align: center;
  }

  .options__value.selected {
    outline: 3px solid rgb(255 255 255 / 50%);
    border-radius: 2px;
  }

  .options__value.active {
    background: yellow;
  }

  .p-content {
    max-height: 400px;
    overflow: auto;
  }

  .p-content__item.active {
    background: yellow;
  }

  .p-video {
    height: 480px;
  }

  .selected {
    background-color: aqua;
  }

  .active {
    border: 1px solid red;
  }

  .full-screen {
    top: 0;
    left: 0;
    position: fixed;
    height: 100vh;
    width: 100vw;
  }
</style>
