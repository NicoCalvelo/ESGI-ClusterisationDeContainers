{{/* Generate fullname */}}
{{- define "pixel-war.fullname" -}}
{{- .Release.Name }}-{{ .Chart.Name }}
{{- end -}}

{{/* Common labels */}}
{{- define "pixel-war.labels" -}}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/instance: {{ .Release.Name }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{- end -}}
