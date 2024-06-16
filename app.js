document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  const resetButton = document.getElementById('resetButton');

  const circles = [
      { x: 100, y: 100, radius: 30, color: 'red', originalColor: 'red' },
      { x: 100, y: 200, radius: 30, color: 'green', originalColor: 'green' },
      { x: 100, y: 300, radius: 30, color: 'blue', originalColor: 'blue' },
      { x: 100, y: 400, radius: 30, color: 'yellow', originalColor: 'yellow' }
  ];

  const arrows = [
      { startX: 700, startY: 100, endX: 650, endY: 100, targetX: 100, targetY: 100, moving: false },
      { startX: 700, startY: 200, endX: 650, endY: 200, targetX: 100, targetY: 200, moving: false },
      { startX: 700, startY: 300, endX: 650, endY: 300, targetX: 100, targetY: 300, moving: false },
      { startX: 700, startY: 400, endX: 650, endY: 400, targetX: 100, targetY: 400, moving: false }
  ];

  function drawCircle(circle) {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
      ctx.fillStyle = circle.color;
      ctx.fill();
      ctx.closePath();
  }

  function drawArrow(arrow) {
      ctx.beginPath();
      ctx.moveTo(arrow.startX, arrow.startY);
      ctx.lineTo(arrow.endX, arrow.endY);
      ctx.strokeStyle = 'black';
      ctx.stroke();

      // Draw arrowhead
      const headLength = 10; // length of head in pixels
      const angle = Math.atan2(arrow.endY - arrow.startY, arrow.endX - arrow.startX);
      ctx.beginPath();
      ctx.moveTo(arrow.endX, arrow.endY);
      ctx.lineTo(arrow.endX - headLength * Math.cos(angle - Math.PI / 6), arrow.endY - headLength * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(arrow.endX, arrow.endY);
      ctx.lineTo(arrow.endX - headLength * Math.cos(angle + Math.PI / 6), arrow.endY - headLength * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
      ctx.closePath();
  }

  function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      circles.forEach(drawCircle);
      arrows.forEach(drawArrow);
  }

  function animateArrow(index) {
      const arrow = arrows[index];
      const circle = circles[index];

      if (!arrow.moving) {
          arrow.moving = true;
          const dx = circle.x - arrow.startX;
          const dy = circle.y - arrow.startY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const velocity = { x: dx / distance, y: dy / distance };

          function move() {
              if (!arrow.moving) return;

              arrow.startX += velocity.x;
              arrow.startY += velocity.y;
              arrow.endX += velocity.x;
              arrow.endY += velocity.y;

              const currentDistance = Math.sqrt(
                  (arrow.endX - circle.x) ** 2 + (arrow.endY - circle.y) ** 2
              );

              if (currentDistance <= circle.radius) {
                  // Ensure the arrow retains its original length when touching the circle
                  const angle = Math.atan2(circle.y - arrow.startY, circle.x - arrow.startX);
                  arrow.endX = circle.x - circle.radius * Math.cos(angle);
                  arrow.endY = circle.y - circle.radius * Math.sin(angle);
                  circle.color = 'grey';
                  arrow.moving = false;
              }

              draw();

              if (arrow.moving) {
                  requestAnimationFrame(move);
              }
          }

          move();
      }
  }

  function reset() {
      arrows.forEach((arrow, index) => {
          arrow.startX = 700;
          arrow.startY = circles[index].y;
          arrow.endX = 650;
          arrow.endY = circles[index].y;
          arrow.moving = false;
      });

      circles.forEach(circle => {
          circle.color = circle.originalColor;
      });

      draw();
  }

  canvas.addEventListener('click', function(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      circles.forEach((circle, index) => {
          const distance = Math.sqrt((x - circle.x) * (x - circle.x) + (y - circle.y) * (y - circle.y));
          if (distance <= circle.radius) {
              animateArrow(index);
          }
      });
  });

  resetButton.addEventListener('click', reset);

  reset();
});
