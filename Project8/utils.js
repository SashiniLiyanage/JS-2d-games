export function drawStatusText(ctx, input, player){
    ctx.font = '20px Helvetica';
    ctx.fillText('Last input: '+input.lastKey, 20, 30);
    ctx.fillText('Active State: '+ player.currentState.state, 20, 60);
}